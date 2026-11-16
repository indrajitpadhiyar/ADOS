import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import crypto from "node:crypto";
import { env } from "../config/env.js";
import { GoogleAdsAccount } from "../models/GoogleAdsAccount.model.js";
import { ConnectedAccount } from "../models/ConnectedAccount.model.js";
import { CryptoUtil } from "../utils/crypto.util.js";
import { ApiError } from "../utils/ApiError.js";
import { SecurityLogger } from "../utils/securityLogger.util.js";

const GOOGLE_ADS_API_VERSION = "v18";
const GOOGLE_ADS_BASE_URL = `https://googleads.googleapis.com/${GOOGLE_ADS_API_VERSION}`;
const OAUTH_SCOPES = [
  "https://www.googleapis.com/auth/adwords",
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",
];

const VALID_DATE_RANGES = [
  "TODAY",
  "YESTERDAY",
  "LAST_7_DAYS",
  "LAST_14_DAYS",
  "LAST_30_DAYS",
  "LAST_90_DAYS",
  "THIS_MONTH",
  "LAST_MONTH",
  "ALL_TIME",
  "CUSTOM",
];

export class GoogleAdsService {
  /**
   * Helper to construct GAQL date filter clauses supporting standard keywords, 90 days, and custom ranges
   */
  static buildDateClause(dateRange = "LAST_30_DAYS", customStartDate = null, customEndDate = null) {
    const normalized = (dateRange || "LAST_30_DAYS").toUpperCase();

    // Custom start and end dates (YYYY-MM-DD)
    if (customStartDate && customEndDate) {
      const cleanStart = customStartDate.toString().trim().slice(0, 10);
      const cleanEnd = customEndDate.toString().trim().slice(0, 10);
      if (/^\d{4}-\d{2}-\d{2}$/.test(cleanStart) && /^\d{4}-\d{2}-\d{2}$/.test(cleanEnd)) {
        return {
          clause: `segments.date BETWEEN '${cleanStart}' AND '${cleanEnd}'`,
          label: `${cleanStart} to ${cleanEnd}`,
          startDate: cleanStart,
          endDate: cleanEnd,
        };
      }
    }

    // Google Ads GAQL doesn't have a "DURING LAST_90_DAYS" enum; calculate ISO dates
    if (normalized === "LAST_90_DAYS") {
      const now = new Date();
      const end = new Date(now);
      end.setDate(end.getDate() - 1);
      const start = new Date(now);
      start.setDate(start.getDate() - 90);

      const formatYmd = (d) => d.toISOString().split("T")[0];
      const startDate = formatYmd(start);
      const endDate = formatYmd(end);

      return {
        clause: `segments.date BETWEEN '${startDate}' AND '${endDate}'`,
        label: "LAST_90_DAYS",
        startDate,
        endDate,
      };
    }

    const standardRanges = [
      "TODAY",
      "YESTERDAY",
      "LAST_7_DAYS",
      "LAST_14_DAYS",
      "LAST_30_DAYS",
      "THIS_MONTH",
      "LAST_MONTH",
      "ALL_TIME",
    ];

    const target = standardRanges.includes(normalized) ? normalized : "LAST_30_DAYS";
    return {
      clause: `segments.date DURING ${target}`,
      label: target,
      startDate: null,
      endDate: null,
    };
  }
  /**
   * Helper to resolve the correct redirect URI with production localhost guards
   */
  static resolveRedirectUri(customUri = null) {
    let uri = customUri || env.GOOGLE_ADS_REDIRECT_URI;
    if (env.NODE_ENV === "production" && uri.includes("localhost")) {
      uri = "https://adosbackend.onrender.com/api/v1/google-ads/callback";
    }
    return uri;
  }

  /**
   * Initialize a configured OAuth2 client
   */
  static getOAuth2Client(customRedirectUri = null) {
    const clientId = env.GOOGLE_CLIENT_ID || env.GOOGLE_ADS_CLIENT_ID || env.GOOGLE_ADS_CLINT_ID;
    const clientSecret = env.GOOGLE_CLIENT_SECRET || env.GOOGLE_ADS_CLIENT_SECRET || env.GOOGLE_ADS_CLINT_SCRIPT;
    const redirectUri = this.resolveRedirectUri(customRedirectUri);

    if (!clientId || !clientSecret) {
      throw ApiError.internal("Google OAuth client credentials are not configured in environment.");
    }

    return new OAuth2Client(clientId, clientSecret, redirectUri);
  }

  /**
   * Generates secure OAuth authorization URL with anti-CSRF state token
   * @param {string} userId - Authenticated ADOS user ID
   * @param {string} [customRedirectUri] - Optional custom redirect URI override
   * @param {string} [returnUrl] - Optional frontend page to redirect back to after OAuth
   * @returns {{ authUrl: string, state: string, redirectUri: string }}
   */
  static generateAuthUrl(userId, customRedirectUri = null, returnUrl = null) {
    const redirectUri = this.resolveRedirectUri(customRedirectUri);
    const oauth2Client = this.getOAuth2Client(redirectUri);

    console.log(`[Google Ads OAuth] Generating authorization URL with redirect_uri: "${redirectUri}"`);

    // Cryptographic anti-CSRF state token tied specifically to the user ID, redirectUri, returnUrl, and unique nonce (expires in 15m)
    const state = jwt.sign(
      {
        userId: userId.toString(),
        purpose: "google_ads_oauth",
        redirectUri,
        returnUrl: returnUrl || null,
        jti: crypto.randomBytes(16).toString("hex"),
        issuedAt: Date.now(),
      },
      env.JWT_ACCESS_SECRET,
      { expiresIn: "15m" }
    );

    const authUrl = oauth2Client.generateAuthUrl({
      access_type: "offline", // Essential for obtaining refresh token
      prompt: "consent", // Force consent prompt to guarantee refresh token generation
      scope: OAUTH_SCOPES,
      state,
      include_granted_scopes: true,
      redirect_uri: redirectUri,
    });

    return { authUrl, state, redirectUri };
  }

  /**
   * Exchanges authorization code for tokens and securely stores them encrypted at rest
   * @param {string} code - OAuth authorization code
   * @param {string} state - OAuth state token
   * @returns {Promise<Object>}
   */
  static async handleOAuthCallback(code, state) {
    if (!code) {
      throw ApiError.badRequest("Authorization code is required.");
    }
    if (!state) {
      throw ApiError.badRequest("OAuth state parameter is required.");
    }

    // 1. Verify anti-CSRF state token
    let decodedState;
    try {
      decodedState = jwt.verify(state, env.JWT_ACCESS_SECRET);
      if (decodedState.purpose !== "google_ads_oauth" || !decodedState.userId) {
        throw new Error("Invalid state payload");
      }
    } catch (err) {
      SecurityLogger.log("GOOGLE_ADS_OAUTH_STATE_INVALID", {
        outcome: "FAILURE",
        details: err.message,
      });
      throw ApiError.badRequest("Invalid or expired OAuth state parameter. Please try connecting again.");
    }

    const userId = decodedState.userId;
    const redirectUri = this.resolveRedirectUri(decodedState.redirectUri);
    const oauth2Client = this.getOAuth2Client(redirectUri);

    // 2. Exchange authorization code for tokens
    let tokens;
    try {
      const response = await oauth2Client.getToken(code);
      tokens = response.tokens;
    } catch (err) {
      SecurityLogger.log("GOOGLE_ADS_OAUTH_CODE_EXCHANGE_FAILED", {
        userId,
        outcome: "FAILURE",
        details: err.message,
      });
      throw ApiError.badRequest(`Failed to exchange authorization code with Google: ${err.message}`);
    }

    // 3. Extract connected user email if available
    let connectedEmail = null;
    if (tokens.id_token) {
      try {
        const ticket = await oauth2Client.verifyIdToken({
          idToken: tokens.id_token,
          audience: [env.GOOGLE_CLIENT_ID, env.GOOGLE_ADS_CLINT_ID].filter(Boolean),
        });
        const payload = ticket.getPayload();
        connectedEmail = payload?.email || null;
      } catch (err) {
        // Fallback: decode token safely without throwing
        const decoded = jwt.decode(tokens.id_token);
        connectedEmail = decoded?.email || null;
      }
    }

    // 4. Retrieve existing integration record (if any) to preserve existing refresh token if not returned
    const existing = await GoogleAdsAccount.findOne({ userId }).select("+encryptedRefreshToken +encryptedAccessToken");

    let refreshToken = tokens.refresh_token;
    if (!refreshToken && existing?.encryptedRefreshToken) {
      // Re-use already saved refresh token if Google didn't issue a new one
      refreshToken = CryptoUtil.decrypt(existing.encryptedRefreshToken);
    }

    if (!refreshToken) {
      throw ApiError.badRequest(
        "Google did not provide an offline refresh token. Please revoke ADOS access in your Google Account security permissions and reconnect with full offline permissions."
      );
    }

    // 5. Encrypt tokens at rest (AES-256-GCM)
    const encryptedRefreshToken = CryptoUtil.encrypt(refreshToken);
    const encryptedAccessToken = tokens.access_token ? CryptoUtil.encrypt(tokens.access_token) : null;
    const tokenExpiry = tokens.expiry_date ? new Date(tokens.expiry_date) : new Date(Date.now() + 3600 * 1000);

    const updatedAccount = await GoogleAdsAccount.findOneAndUpdate(
      { userId },
      {
        userId,
        encryptedRefreshToken,
        encryptedAccessToken,
        tokenExpiry,
        scope: tokens.scope || OAUTH_SCOPES.join(" "),
        connectedEmail: connectedEmail || existing?.connectedEmail || null,
        status: "CONNECTED",
        errorMessage: null,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    SecurityLogger.log("GOOGLE_ADS_CONNECTED_SUCCESS", {
      userId,
      outcome: "SUCCESS",
    });

    // 6. Proactively attempt customer accounts discovery if developer token is available
    if (env.GOOGLE_ADS_DEVELOPER_TOKEN) {
      try {
        await this.syncAccessibleCustomers(userId);
      } catch (discoveryErr) {
        console.warn("Notice: Initial customer discovery deferred:", discoveryErr.message);
      }
    } else {
      console.info("Info: GOOGLE_ADS_DEVELOPER_TOKEN not configured; customer accounts discovery deferred.");
    }

    return await this.getStatus(userId);
  }

  /**
   * Retrieves or refreshes a valid Google Ads access token for the given account
   * @param {Object} account - GoogleAdsAccount mongoose document (must include select: true for tokens)
   * @returns {Promise<string>} Plaintext valid access token
   */
  static async getValidAccessToken(account) {
    if (!account) {
      throw ApiError.unauthorized("Google Ads account integration not found.");
    }

    const now = Date.now();
    const expiryBufferMs = 5 * 60 * 1000; // 5-minute safety buffer

    // Check if current access token is still fresh
    if (account.tokenExpiry && account.tokenExpiry.getTime() - now > expiryBufferMs && account.encryptedAccessToken) {
      try {
        const decrypted = CryptoUtil.decrypt(account.encryptedAccessToken);
        if (decrypted) return decrypted;
      } catch (e) {
        // Fall through to refresh
      }
    }

    // Refresh token needed
    if (!account.encryptedRefreshToken) {
      throw ApiError.unauthorized("No refresh token stored. Please reconnect Google Ads.");
    }

    let refreshToken;
    try {
      refreshToken = CryptoUtil.decrypt(account.encryptedRefreshToken);
    } catch (err) {
      throw ApiError.internal("Failed to decrypt stored credentials.");
    }

    const oauth2Client = this.getOAuth2Client();
    oauth2Client.setCredentials({ refresh_token: refreshToken });

    try {
      const response = await oauth2Client.getAccessToken();
      const newAccessToken = response.token;
      if (!newAccessToken) {
        throw new Error("Google returned an empty access token");
      }

      const newExpiry = new Date(Date.now() + 3500 * 1000); // Standard 1 hour validity

      // Update in background
      await GoogleAdsAccount.updateOne(
        { _id: account._id },
        {
          encryptedAccessToken: CryptoUtil.encrypt(newAccessToken),
          tokenExpiry: newExpiry,
          status: "CONNECTED",
          errorMessage: null,
        }
      );

      return newAccessToken;
    } catch (refreshErr) {
      const errorMsg = refreshErr.message || "";
      let newStatus = "ERROR";

      if (errorMsg.includes("invalid_grant") || errorMsg.includes("revoked") || errorMsg.includes("expired")) {
        newStatus = "REVOKED";
      }

      await GoogleAdsAccount.updateOne(
        { _id: account._id },
        {
          status: newStatus,
          errorMessage: `Google token refresh failed: ${errorMsg}`,
        }
      );

      throw ApiError.unauthorized(
        newStatus === "REVOKED"
          ? "Your Google Ads session was revoked or expired. Please reconnect your Google Ads account."
          : `Failed to refresh Google Ads token: ${errorMsg}`
      );
    }
  }

  /**
   * Formats a raw customer ID into standard Google Ads xxx-xxx-xxxx display format
   * @param {string} rawId
   * @returns {string}
   */
  static formatCustomerId(rawId) {
    if (!rawId) return "";
    const clean = rawId.toString().replace(/\D/g, "");
    if (clean.length === 10) {
      return `${clean.slice(0, 3)}-${clean.slice(3, 6)}-${clean.slice(6)}`;
    }
    return rawId;
  }

  /**
   * Strips formatting to provide raw 10-digit customer ID for Google API requests
   * @param {string} id
   * @returns {string}
   */
  static cleanCustomerId(id) {
    if (!id) return "";
    return id.toString().replace(/\D/g, "");
  }

  /**
   * Helper to parse detailed error messages and codes from Google Ads API responses
   * @param {Response} response
   * @returns {Promise<{ message: string, authError: string, status: number }>}
   */
  static async parseGoogleAdsError(response) {
    const errorJson = await response.json().catch(() => ({}));
    const errorDetails = errorJson.error?.details?.[0]?.errors?.[0];
    const authError = errorDetails?.errorCode?.authorizationError || "";
    const message =
      errorDetails?.message ||
      errorJson.error?.message ||
      `HTTP ${response.status} from Google Ads API`;

    return {
      status: response.status,
      message,
      authError,
    };
  }

  /**
   * Checks if an error corresponds to Test-account-only access restriction on the Google Cloud project
   * (e.g. CLOUD_PROJECT_NOT_APPROVED_FOR_PRODUCTION, DEVELOPER_TOKEN_NOT_APPROVED, ACTION_NOT_PERMITTED)
   * @param {number} status
   * @param {{ message: string, authError: string }} errInfo
   * @returns {boolean}
   */
  static isTestAccountRestrictedError(status, errInfo) {
    if (status !== 403) return false;
    const authErr = errInfo.authError || "";
    const msg = (errInfo.message || "").toLowerCase();

    return (
      authErr === "CLOUD_PROJECT_NOT_APPROVED_FOR_PRODUCTION" ||
      authErr === "DEVELOPER_TOKEN_NOT_APPROVED" ||
      authErr === "ACTION_NOT_PERMITTED" ||
      msg.includes("cloud_project_not_approved_for_production") ||
      msg.includes("developer_token_not_approved") ||
      msg.includes("action_not_permitted") ||
      msg.includes("not approved for production") ||
      msg.includes("not approved to access production")
    );
  }

  /**
   * Synchronizes and discovers all accessible Google Ads customer accounts for the user
   * @param {string} userId
   * @returns {Promise<Array>} List of accessible customers
   */
  static async syncAccessibleCustomers(userId) {
    if (!env.GOOGLE_ADS_DEVELOPER_TOKEN) {
      throw ApiError.badRequest(
        "Google Ads Developer Token is not configured on the server. Please set GOOGLE_ADS_DEVELOPER_TOKEN in your backend environment variables to discover and query Google Ads accounts. (OAuth authorization was saved successfully)."
      );
    }

    const account = await GoogleAdsAccount.findOne({ userId }).select("+encryptedRefreshToken +encryptedAccessToken");
    if (!account) {
      throw ApiError.notFound("No connected Google Ads integration found. Please connect first.");
    }

    const accessToken = await this.getValidAccessToken(account);

    const headers = {
      Authorization: `Bearer ${accessToken}`,
      "developer-token": env.GOOGLE_ADS_DEVELOPER_TOKEN,
      "Content-Type": "application/json",
    };

    // Call official CustomerService:listAccessibleCustomers endpoint
    let listResponse;
    try {
      listResponse = await fetch(`${GOOGLE_ADS_BASE_URL}/customers:listAccessibleCustomers`, {
        method: "GET",
        headers,
      });
    } catch (netErr) {
      throw ApiError.internal(`Network failure contacting Google Ads API: ${netErr.message}`);
    }

    if (!listResponse.ok) {
      const err = await this.parseGoogleAdsError(listResponse);

      if (this.isTestAccountRestrictedError(listResponse.status, err)) {
        throw ApiError.forbidden(
          "Your Google Cloud project currently has Test access and can only access Google Ads Test Accounts. While your Explorer access application is under review in Google Cloud Console, please test with a Google Ads Test Account."
        );
      }

      if (listResponse.status === 401) {
        throw ApiError.unauthorized("Google Ads authentication failed. Please reconnect your account.");
      }

      throw ApiError.badRequest(`Google Ads API error: ${err.message}`);
    }

    const listData = await listResponse.json();
    const resourceNames = listData.resourceNames || [];

    // Extract individual customer accounts details
    const discovered = [];

    for (const resourceName of resourceNames) {
      const rawId = resourceName.replace("customers/", "").trim();
      if (!rawId) continue;

      let customerMeta = {
        id: rawId,
        descriptiveName: `Google Ads (${this.formatCustomerId(rawId)})`,
        currencyCode: "USD",
        timeZone: "UTC",
        manager: false,
        testAccount: false,
        managerId: null,
        isProductionRestricted: false,
        restrictionReason: null,
      };

      // Attempt to query customer details via GoogleAdsService:search
      try {
        const queryRes = await fetch(`${GOOGLE_ADS_BASE_URL}/customers/${rawId}/googleAds:search`, {
          method: "POST",
          headers: {
            ...headers,
            "login-customer-id": rawId,
          },
          body: JSON.stringify({
            query: `
              SELECT 
                customer.id, 
                customer.descriptive_name, 
                customer.currency_code, 
                customer.time_zone, 
                customer.manager, 
                customer.test_account 
              FROM customer 
              LIMIT 1
            `,
          }),
        });

        if (queryRes.ok) {
          const queryData = await queryRes.json();
          const row = queryData.results?.[0]?.customer;
          if (row) {
            const isTest = Boolean(row.testAccount);
            customerMeta = {
              id: rawId,
              descriptiveName: row.descriptiveName || `Account ${this.formatCustomerId(rawId)}`,
              currencyCode: row.currencyCode || "USD",
              timeZone: row.timeZone || "UTC",
              manager: Boolean(row.manager),
              testAccount: isTest,
              managerId: null,
              isProductionRestricted: !isTest,
              restrictionReason: !isTest
                ? "Production Account (Requires Explorer or Basic Access)"
                : null,
            };

            // If this is a Manager Account (e.g. Test MCC), discover child client accounts!
            if (row.manager) {
              try {
                const clientRes = await fetch(`${GOOGLE_ADS_BASE_URL}/customers/${rawId}/googleAds:search`, {
                  method: "POST",
                  headers: {
                    ...headers,
                    "login-customer-id": rawId,
                  },
                  body: JSON.stringify({
                    query: `
                      SELECT 
                        customer_client.id, 
                        customer_client.descriptive_name, 
                        customer_client.currency_code, 
                        customer_client.time_zone, 
                        customer_client.manager, 
                        customer_client.test_account, 
                        customer_client.status 
                      FROM customer_client 
                      WHERE customer_client.status = 'ENABLED' 
                      LIMIT 50
                    `,
                  }),
                });

                if (clientRes.ok) {
                  const clientData = await clientRes.json();
                  const clientRows = clientData.results || [];
                  for (const cRow of clientRows) {
                    const client = cRow.customerClient;
                    if (client && client.id && client.id.toString() !== rawId) {
                      const childIsTest = Boolean(client.testAccount);
                      discovered.push({
                        id: client.id.toString(),
                        descriptiveName: client.descriptiveName || `Test Account (${this.formatCustomerId(client.id)})`,
                        currencyCode: client.currencyCode || "USD",
                        timeZone: client.timeZone || "UTC",
                        manager: Boolean(client.manager),
                        testAccount: childIsTest,
                        managerId: rawId, // Store parent MCC ID as login-customer-id!
                        isProductionRestricted: !childIsTest,
                        restrictionReason: !childIsTest
                          ? "Production Account (Requires Explorer or Basic Access)"
                          : null,
                      });
                    }
                  }
                }
              } catch (clientErr) {
                // Non-blocking child account discovery
              }
            }
          }
        } else {
          // If query failed, check if it's because this account is production-restricted under Test Access
          const err = await this.parseGoogleAdsError(queryRes);
          if (this.isTestAccountRestrictedError(queryRes.status, err)) {
            customerMeta.isProductionRestricted = true;
            customerMeta.testAccount = false;
            customerMeta.restrictionReason = "Production Account (Restricted under Google Test Access)";
          }
        }
      } catch (err) {
        // Non-blocking: continue with basic metadata
      }

      discovered.push(customerMeta);
    }

    // Persist discovered accounts in DB
    account.accessibleCustomers = discovered;
    account.lastSyncAt = new Date();
    await account.save();

    return discovered;
  }

  /**
   * Directly links and verifies an eligible Google Ads Test Account by ID
   * Allows adding test client accounts and test MCCs directly
   * @param {string} userId
   * @param {string} customerId
   * @param {string} [managerId]
   */
  static async linkTestCustomerAccount(userId, customerId, managerId = null) {
    const cleanId = this.cleanCustomerId(customerId);
    if (!cleanId) {
      throw ApiError.badRequest("Valid 10-digit Google Ads Customer ID is required.");
    }

    if (!env.GOOGLE_ADS_DEVELOPER_TOKEN) {
      throw ApiError.badRequest("Google Ads Developer Token is not configured on the server.");
    }

    const account = await GoogleAdsAccount.findOne({ userId }).select("+encryptedRefreshToken +encryptedAccessToken");
    if (!account) {
      throw ApiError.notFound("No Google Ads connection found. Please connect first.");
    }

    const accessToken = await this.getValidAccessToken(account);
    const cleanManagerId = managerId ? this.cleanCustomerId(managerId) : null;

    const headers = {
      Authorization: `Bearer ${accessToken}`,
      "developer-token": env.GOOGLE_ADS_DEVELOPER_TOKEN,
      "Content-Type": "application/json",
      ...(cleanManagerId ? { "login-customer-id": cleanManagerId } : { "login-customer-id": cleanId }),
    };

    // Query customer metadata
    const queryRes = await fetch(`${GOOGLE_ADS_BASE_URL}/customers/${cleanId}/googleAds:search`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        query: `
          SELECT 
            customer.id, 
            customer.descriptive_name, 
            customer.currency_code, 
            customer.time_zone, 
            customer.manager, 
            customer.test_account 
          FROM customer 
          LIMIT 1
        `,
      }),
    });

    if (!queryRes.ok) {
      const err = await this.parseGoogleAdsError(queryRes);
      if (this.isTestAccountRestrictedError(queryRes.status, err)) {
        throw ApiError.forbidden(
          `Account ${this.formatCustomerId(cleanId)} is a Production Account. Your Google Ads API access is currently restricted to Test Accounts. Please enter an eligible Google Ads Test Account ID.`
        );
      }
      throw ApiError.badRequest(`Failed to verify Google Ads account: ${err.message}`);
    }

    const queryData = await queryRes.json();
    const row = queryData.results?.[0]?.customer;
    if (!row) {
      throw ApiError.notFound(`Account ${this.formatCustomerId(cleanId)} could not be found.`);
    }

    const testMeta = {
      id: cleanId,
      descriptiveName: row.descriptiveName || `Test Account (${this.formatCustomerId(cleanId)})`,
      currencyCode: row.currencyCode || "USD",
      timeZone: row.timeZone || "UTC",
      manager: Boolean(row.manager),
      testAccount: Boolean(row.testAccount),
      managerId: cleanManagerId,
      isProductionRestricted: !Boolean(row.testAccount),
      restrictionReason: !Boolean(row.testAccount)
        ? "Production Account (Requires Explorer or Basic Access)"
        : null,
    };

    // Add or update in accessibleCustomers
    const existingIndex = (account.accessibleCustomers || []).findIndex((c) => c.id === cleanId);
    if (existingIndex >= 0) {
      account.accessibleCustomers[existingIndex] = testMeta;
    } else {
      account.accessibleCustomers.push(testMeta);
    }

    // Set as active selected account
    account.selectedCustomerId = cleanId;
    account.selectedCustomerName = testMeta.descriptiveName;
    account.selectedCustomerCurrency = testMeta.currencyCode;
    account.selectedCustomerTimeZone = testMeta.timeZone;
    account.isManagerAccount = testMeta.manager;
    account.isTestAccount = testMeta.testAccount;
    account.isProductionRestricted = testMeta.isProductionRestricted;
    account.loginCustomerId = cleanManagerId || (testMeta.manager ? cleanId : null);
    if (!account.selectedCustomerIds.includes(cleanId)) {
      account.selectedCustomerIds.push(cleanId);
    }
    await account.save();

    await ConnectedAccount.findOneAndUpdate(
      { userId, platform: "google", accountId: this.formatCustomerId(cleanId) },
      {
        userId,
        name: testMeta.descriptiveName,
        accountId: this.formatCustomerId(cleanId),
        platform: "google",
        currency: testMeta.currencyCode === "INR" ? "INR (₹)" : `${testMeta.currencyCode} ($)`,
        status: testMeta.isProductionRestricted ? "Warning" : "Healthy",
        lastSync: "Just now",
        iconBg: "bg-emerald-600",
      },
      { upsert: true, new: true }
    );

    return await this.getStatus(userId);
  }

  /**
   * Selects active customer account(s) for campaigns reporting
   * Supports both single account selection and multiple accounts selection per user
   * @param {string} userId
   * @param {string|Object} optionsOrCustomerId
   * @param {string} [managerId]
   */
  static async selectCustomerAccount(userId, optionsOrCustomerId, managerId = null) {
    let targetCustomerId = null;
    let targetCustomerIds = [];
    let targetManagerId = managerId;

    if (typeof optionsOrCustomerId === "object" && optionsOrCustomerId !== null) {
      targetCustomerId = optionsOrCustomerId.customerId || null;
      targetCustomerIds = Array.isArray(optionsOrCustomerId.customerIds) ? optionsOrCustomerId.customerIds : [];
      if (optionsOrCustomerId.managerId) {
        targetManagerId = optionsOrCustomerId.managerId;
      }
    } else {
      targetCustomerId = optionsOrCustomerId;
    }

    // Clean all IDs
    const cleanIds = [
      ...(targetCustomerId ? [this.cleanCustomerId(targetCustomerId)] : []),
      ...targetCustomerIds.map((id) => this.cleanCustomerId(id)),
    ].filter(Boolean);

    const uniqueCleanIds = Array.from(new Set(cleanIds));

    if (uniqueCleanIds.length === 0) {
      throw ApiError.badRequest("At least one valid Google Ads Customer ID is required.");
    }

    const primaryId = targetCustomerId ? this.cleanCustomerId(targetCustomerId) : uniqueCleanIds[0];

    const account = await GoogleAdsAccount.findOne({ userId });
    if (!account) {
      throw ApiError.notFound("No Google Ads connection found.");
    }

    // Find primary account metadata
    const matched = account.accessibleCustomers.find((c) => c.id === primaryId);
    const customerName = matched?.descriptiveName || `Google Ads (${this.formatCustomerId(primaryId)})`;
    const currency = matched?.currencyCode || "USD";
    const timeZone = matched?.timeZone || "UTC";
    const isManager = Boolean(matched?.manager);
    const isTest = Boolean(matched?.testAccount);
    const isRestricted = Boolean(matched?.isProductionRestricted);

    account.selectedCustomerId = primaryId;
    account.selectedCustomerIds = uniqueCleanIds;
    account.selectedCustomerName = customerName;
    account.selectedCustomerCurrency = currency;
    account.selectedCustomerTimeZone = timeZone;
    account.isManagerAccount = isManager;
    account.isTestAccount = isTest;
    account.isProductionRestricted = isRestricted;
    account.loginCustomerId = matched?.managerId || targetManagerId || (isManager ? primaryId : null);
    await account.save();

    // Sync all selected accounts into ADOS ConnectedAccount model for multi-account consistency
    for (const accId of uniqueCleanIds) {
      const accMatch = account.accessibleCustomers.find((c) => c.id === accId);
      const accName = accMatch?.descriptiveName || `Google Ads (${this.formatCustomerId(accId)})`;
      const accCurr = accMatch?.currencyCode || "USD";
      const accRestricted = Boolean(accMatch?.isProductionRestricted);

      await ConnectedAccount.findOneAndUpdate(
        { userId, platform: "google", accountId: this.formatCustomerId(accId) },
        {
          userId,
          name: accName,
          accountId: this.formatCustomerId(accId),
          platform: "google",
          currency: accCurr === "INR" ? "INR (₹)" : `${accCurr} ($)`,
          status: accRestricted ? "Warning" : "Healthy",
          lastSync: "Just now",
          iconBg: "bg-emerald-600",
        },
        { upsert: true, new: true }
      );
    }

    return await this.getStatus(userId);
  }

  /**
   * Fetches real-time campaigns, date-wise performance, and metrics for the active account using GAQL
   * @param {string} userId
   * @param {Object} options
   * @returns {Promise<Object>}
   */
  static async getCampaigns(userId, { dateRange = "LAST_30_DAYS", startDate = null, endDate = null, limit = 50 } = {}) {
    const account = await GoogleAdsAccount.findOne({ userId }).select("+encryptedRefreshToken +encryptedAccessToken");
    if (!account) {
      throw ApiError.notFound("No Google Ads integration found. Please connect your account first.");
    }

    if (!account.selectedCustomerId) {
      throw ApiError.badRequest("No Google Ads customer account selected. Please select an active account first.");
    }

    if (!env.GOOGLE_ADS_DEVELOPER_TOKEN) {
      throw ApiError.badRequest(
        "Google Ads Developer Token is not configured on the server. Please set GOOGLE_ADS_DEVELOPER_TOKEN in your backend environment variables to query campaigns."
      );
    }

    if (account.isProductionRestricted) {
      throw ApiError.forbidden(
        `Account ${this.formatCustomerId(account.selectedCustomerId)} is a Production Google Ads account. Google Ads API restricts Test Access tokens to Google Ads Test Accounts only. To view live analytics for this production account, submit an application for Basic or Standard Access in Google Ads API Center. For immediate testing, please switch to an eligible Google Ads Test Account.`
      );
    }

    const dateInfo = this.buildDateClause(dateRange, startDate, endDate);
    const customerId = account.selectedCustomerId;
    const accessToken = await this.getValidAccessToken(account);

    const headers = {
      Authorization: `Bearer ${accessToken}`,
      "developer-token": env.GOOGLE_ADS_DEVELOPER_TOKEN,
      "Content-Type": "application/json",
    };

    if (account.loginCustomerId) {
      headers["login-customer-id"] = account.loginCustomerId;
    }

    // 1. Google Ads Query Language (GAQL) query for Campaign performance reporting
    const gaqlQuery = `
      SELECT 
        campaign.id, 
        campaign.name, 
        campaign.status, 
        campaign.advertising_channel_type, 
        campaign.start_date, 
        campaign.end_date, 
        metrics.impressions, 
        metrics.clicks, 
        metrics.cost_micros, 
        metrics.ctr, 
        metrics.average_cpc, 
        metrics.conversions, 
        metrics.conversions_value 
      FROM campaign 
      WHERE ${dateInfo.clause} 
      ORDER BY metrics.impressions DESC 
      LIMIT ${Math.min(Number(limit) || 50, 100)}
    `;

    // 2. GAQL query for date-wise daily aggregate performance (for line/area charts)
    const dailyGaqlQuery = `
      SELECT 
        segments.date, 
        metrics.impressions, 
        metrics.clicks, 
        metrics.cost_micros, 
        metrics.conversions, 
        metrics.conversions_value 
      FROM customer 
      WHERE ${dateInfo.clause} 
      ORDER BY segments.date ASC
    `;

    let searchResponse;
    let dailySearchResponse;

    try {
      [searchResponse, dailySearchResponse] = await Promise.all([
        fetch(`${GOOGLE_ADS_BASE_URL}/customers/${customerId}/googleAds:search`, {
          method: "POST",
          headers,
          body: JSON.stringify({ query: gaqlQuery }),
        }),
        fetch(`${GOOGLE_ADS_BASE_URL}/customers/${customerId}/googleAds:search`, {
          method: "POST",
          headers,
          body: JSON.stringify({ query: dailyGaqlQuery }),
        }).catch(() => null),
      ]);
    } catch (netErr) {
      throw ApiError.internal(`Network failure fetching Google Ads campaigns: ${netErr.message}`);
    }

    if (!searchResponse.ok) {
      const err = await this.parseGoogleAdsError(searchResponse);

      if (this.isTestAccountRestrictedError(searchResponse.status, err)) {
        await GoogleAdsAccount.updateOne(
          { _id: account._id },
          { isProductionRestricted: true }
        );
        throw ApiError.forbidden(
          `Account ${this.formatCustomerId(customerId)} is a Production Google Ads account. Google Ads API restricts Test Access to Google Ads Test Accounts only. To view live analytics for this production account, submit an application for Basic or Standard Access in Google Ads API Center. For immediate testing, please switch to an eligible Google Ads Test Account.`
        );
      }

      if (searchResponse.status === 403 && (err.authError === "USER_PERMISSION_DENIED" || err.message.includes("USER_PERMISSION_DENIED"))) {
        throw ApiError.forbidden(
          `Permission denied for Customer ID ${this.formatCustomerId(customerId)}. Verify that your authenticated Google user has Read access, or set the appropriate Manager login-customer-id.`
        );
      }

      throw ApiError.badRequest(`Google Ads API error: ${err.message}`);
    }

    const data = await searchResponse.json();
    const rows = data.results || [];

    // Parse date-wise performance
    let dateWisePerformance = [];
    if (dailySearchResponse && dailySearchResponse.ok) {
      try {
        const dailyData = await dailySearchResponse.json();
        const dailyRows = dailyData.results || [];
        dateWisePerformance = dailyRows.map((row) => {
          const m = row.metrics || {};
          const cMicros = Number(m.costMicros || 0);
          const imps = Number(m.impressions || 0);
          const clks = Number(m.clicks || 0);
          const convs = Number(m.conversions || 0);
          const convVal = m.conversionsValue ? Number(m.conversionsValue) : 0;
          const cost = +(cMicros / 1000000).toFixed(2);
          const ctr = imps > 0 ? +((clks / imps) * 100).toFixed(2) : 0;
          const cpc = clks > 0 ? +(cost / clks).toFixed(2) : 0;

          return {
            date: row.segments?.date || "",
            spend: cost,
            impressions: imps,
            clicks: clks,
            ctr,
            averageCpc: cpc,
            conversions: convs,
            conversionsValue: +convVal.toFixed(2),
          };
        });
      } catch (e) {
        dateWisePerformance = [];
      }
    }

    // Aggregate summary counters
    let totalSpendMicros = 0;
    let totalImpressions = 0;
    let totalClicks = 0;
    let totalConversions = 0;
    let totalConversionsValue = 0;

    const campaigns = rows.map((row) => {
      const c = row.campaign || {};
      const m = row.metrics || {};

      const costMicros = Number(m.costMicros || 0);
      const impressions = Number(m.impressions || 0);
      const clicks = Number(m.clicks || 0);
      const conversions = Number(m.conversions || 0);
      const convValue = m.conversionsValue ? Number(m.conversionsValue) : 0;
      const rawCtr = m.ctr !== undefined ? Number(m.ctr) : null;
      const avgCpcMicros = Number(m.averageCpc || 0);

      totalSpendMicros += costMicros;
      totalImpressions += impressions;
      totalClicks += clicks;
      totalConversions += conversions;
      totalConversionsValue += convValue;

      const cost = +(costMicros / 1000000).toFixed(2);
      const roas = cost > 0 && convValue > 0 ? +(convValue / cost).toFixed(2) : null;

      return {
        id: c.id,
        name: c.name || "Unnamed Campaign",
        status: c.status || "UNKNOWN",
        channelType: c.advertisingChannelType || "SEARCH",
        startDate: c.startDate || null,
        endDate: c.endDate || null,
        impressions,
        clicks,
        // Convert micros to standard currency units (1,000,000 micros = 1 currency unit)
        cost,
        costMicros,
        ctrPercent: rawCtr !== null ? +(rawCtr * 100).toFixed(2) : (impressions > 0 ? +((clicks / impressions) * 100).toFixed(2) : 0),
        averageCpc: +(avgCpcMicros / 1000000).toFixed(2),
        conversions,
        conversionsValue: +convValue.toFixed(2),
        roas,
      };
    });

    const totalCost = +(totalSpendMicros / 1000000).toFixed(2);
    const overallCtr = totalImpressions > 0 ? +((totalClicks / totalImpressions) * 100).toFixed(2) : 0;
    const overallAvgCpc = totalClicks > 0 ? +(totalCost / totalClicks).toFixed(2) : 0;
    const overallRoas = totalCost > 0 && totalConversionsValue > 0 ? +(totalConversionsValue / totalCost).toFixed(2) : null;

    return {
      selectedAccount: {
        id: account.selectedCustomerId,
        formattedId: this.formatCustomerId(account.selectedCustomerId),
        name: account.selectedCustomerName,
        currency: account.selectedCustomerCurrency,
        timeZone: account.selectedCustomerTimeZone,
        isTestAccount: account.isTestAccount,
        isManagerAccount: account.isManagerAccount,
      },
      dateRange: dateInfo.label,
      startDate: dateInfo.startDate,
      endDate: dateInfo.endDate,
      metricsSummary: {
        totalCost,
        totalImpressions,
        totalClicks,
        overallCtr,
        overallAvgCpc,
        totalConversions,
        totalConversionsValue: +totalConversionsValue.toFixed(2),
        overallRoas,
        campaignCount: campaigns.length,
      },
      dateWisePerformance,
      campaigns,
    };
  }

  /**
   * Retrieves connection and selected account status for the authenticated user
   * @param {string} userId
   * @returns {Promise<Object>}
   */
  static async getStatus(userId) {
    const account = await GoogleAdsAccount.findOne({ userId });

    if (!account) {
      return {
        isConnected: false,
        status: "NOT_CONNECTED",
        hasDeveloperToken: Boolean(env.GOOGLE_ADS_DEVELOPER_TOKEN),
        connectedEmail: null,
        selectedAccount: null,
        selectedCustomerId: null,
        selectedCustomerIds: [],
        accessibleCustomers: [],
        lastSyncAt: null,
      };
    }

    const selectedIds = Array.isArray(account.selectedCustomerIds) && account.selectedCustomerIds.length > 0
      ? account.selectedCustomerIds
      : (account.selectedCustomerId ? [account.selectedCustomerId] : []);

    return {
      isConnected: account.status === "CONNECTED",
      status: account.status,
      hasDeveloperToken: Boolean(env.GOOGLE_ADS_DEVELOPER_TOKEN),
      apiAccessMode: "TEST_ACCESS",
      connectedEmail: account.connectedEmail,
      selectedCustomerId: account.selectedCustomerId || null,
      selectedCustomerIds: selectedIds,
      selectedCustomerName: account.selectedCustomerName || null,
      selectedAccount: account.selectedCustomerId
        ? {
            id: account.selectedCustomerId,
            formattedId: this.formatCustomerId(account.selectedCustomerId),
            name: account.selectedCustomerName,
            currency: account.selectedCustomerCurrency,
            timeZone: account.selectedCustomerTimeZone,
            isManager: account.isManagerAccount,
            isTestAccount: account.isTestAccount,
            isProductionRestricted: Boolean(account.isProductionRestricted),
          }
        : null,
      accessibleCustomers: (account.accessibleCustomers || []).map((c) => ({
        id: c.id,
        formattedId: this.formatCustomerId(c.id),
        descriptiveName: c.descriptiveName,
        currencyCode: c.currencyCode,
        timeZone: c.timeZone,
        manager: Boolean(c.manager),
        testAccount: Boolean(c.testAccount),
        managerId: c.managerId || null,
        isProductionRestricted: Boolean(c.isProductionRestricted),
        restrictionReason: c.restrictionReason || (c.isProductionRestricted ? "Production Account (Restricted under Test Access)" : null),
        selected: selectedIds.includes(c.id) || c.id === account.selectedCustomerId,
      })),
      lastSyncAt: account.lastSyncAt,
      errorMessage: account.errorMessage,
    };
  }

  /**
   * Disconnects Google Ads, optionally revoking the OAuth token with Google
   * @param {string} userId
   * @returns {Promise<boolean>}
   */
  static async disconnect(userId) {
    const account = await GoogleAdsAccount.findOne({ userId }).select("+encryptedRefreshToken");

    if (account && account.encryptedRefreshToken) {
      try {
        const refreshToken = CryptoUtil.decrypt(account.encryptedRefreshToken);
        if (refreshToken) {
          // Non-blocking revoke token with Google
          fetch(`https://oauth2.googleapis.com/revoke?token=${encodeURIComponent(refreshToken)}`, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
          }).catch(() => {});
        }
      } catch (err) {
        // Ignore revocation errors
      }
    }

    await GoogleAdsAccount.deleteOne({ userId });

    // Update ConnectedAccount status
    await ConnectedAccount.findOneAndUpdate(
      { userId, platform: "google" },
      { status: "Paused", lastSync: "Disconnected" }
    );

    SecurityLogger.log("GOOGLE_ADS_DISCONNECTED", {
      userId,
      outcome: "SUCCESS",
    });

    return true;
  }
}
