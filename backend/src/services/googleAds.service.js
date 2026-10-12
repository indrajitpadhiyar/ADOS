import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
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
  "THIS_MONTH",
  "LAST_MONTH",
  "ALL_TIME",
];

export class GoogleAdsService {
  /**
   * Initialize a configured OAuth2 client
   */
  static getOAuth2Client() {
    const clientId = env.GOOGLE_CLIENT_ID || env.GOOGLE_ADS_CLINT_ID;
    const clientSecret = env.GOOGLE_CLIENT_SECRET || env.GOOGLE_ADS_CLINT_SCRIPT;
    const redirectUri = env.GOOGLE_ADS_REDIRECT_URI;

    if (!clientId || !clientSecret) {
      throw ApiError.internal("Google OAuth client credentials are not configured in environment.");
    }

    return new OAuth2Client(clientId, clientSecret, redirectUri);
  }

  /**
   * Generates secure OAuth authorization URL with anti-CSRF state token
   * @param {string} userId - Authenticated ADOS user ID
   * @returns {{ authUrl: string, state: string }}
   */
  static generateAuthUrl(userId) {
    const redirectUri = env.GOOGLE_ADS_REDIRECT_URI;
    const oauth2Client = this.getOAuth2Client();

    // Cryptographic anti-CSRF state token tied specifically to the user ID and active redirectUri (expires in 15m)
    const state = jwt.sign(
      {
        userId: userId.toString(),
        purpose: "google_ads_oauth",
        redirectUri,
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
    });

    return { authUrl, state };
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
    const redirectUri = decodedState.redirectUri || env.GOOGLE_ADS_REDIRECT_URI;
    const clientId = env.GOOGLE_CLIENT_ID || env.GOOGLE_ADS_CLINT_ID;
    const clientSecret = env.GOOGLE_CLIENT_SECRET || env.GOOGLE_ADS_CLINT_SCRIPT;
    const oauth2Client = new OAuth2Client(clientId, clientSecret, redirectUri);

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

    // 6. Proactively attempt customer accounts discovery
    try {
      await this.syncAccessibleCustomers(userId);
    } catch (discoveryErr) {
      console.warn("Notice: Initial customer discovery deferred:", discoveryErr.message);
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
    const account = await GoogleAdsAccount.findOne({ userId }).select("+encryptedRefreshToken +encryptedAccessToken");
    if (!account) {
      throw ApiError.notFound("No connected Google Ads integration found. Please connect first.");
    }

    const accessToken = await this.getValidAccessToken(account);

    // Following Google's Sept 2026 developer token sunset, developer-token headers
    // are obsolete. Access level is determined directly by the Google Cloud Project.
    const headers = {
      Authorization: `Bearer ${accessToken}`,
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
            customerMeta = {
              id: rawId,
              descriptiveName: row.descriptiveName || `Account ${this.formatCustomerId(rawId)}`,
              currencyCode: row.currencyCode || "USD",
              timeZone: row.timeZone || "UTC",
              manager: Boolean(row.manager),
              testAccount: Boolean(row.testAccount),
            };
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
   * Selects an active customer account for campaigns reporting
   * @param {string} userId
   * @param {string} customerId
   * @param {string} [managerId]
   */
  static async selectCustomerAccount(userId, customerId, managerId = null) {
    const cleanId = this.cleanCustomerId(customerId);
    if (!cleanId) {
      throw ApiError.badRequest("Valid Google Ads Customer ID is required.");
    }

    const account = await GoogleAdsAccount.findOne({ userId });
    if (!account) {
      throw ApiError.notFound("No Google Ads connection found.");
    }

    // Find account in discovered list or default
    const matched = account.accessibleCustomers.find((c) => c.id === cleanId);

    const customerName = matched?.descriptiveName || `Google Ads (${this.formatCustomerId(cleanId)})`;
    const currency = matched?.currencyCode || "USD";
    const timeZone = matched?.timeZone || "UTC";
    const isManager = Boolean(matched?.manager);
    const isTest = Boolean(matched?.testAccount);

    account.selectedCustomerId = cleanId;
    account.selectedCustomerName = customerName;
    account.selectedCustomerCurrency = currency;
    account.selectedCustomerTimeZone = timeZone;
    account.isManagerAccount = isManager;
    account.isTestAccount = isTest;
    account.loginCustomerId = managerId ? this.cleanCustomerId(managerId) : (isManager ? cleanId : null);
    await account.save();

    // Sync with ADOS ConnectedAccount model so it surfaces consistently in ADOS multi-platform UI
    await ConnectedAccount.findOneAndUpdate(
      { userId, platform: "google" },
      {
        userId,
        name: customerName,
        accountId: this.formatCustomerId(cleanId),
        platform: "google",
        currency: currency === "INR" ? "INR (₹)" : `${currency} ($)`,
        status: "Healthy",
        lastSync: "Just now",
        iconBg: "bg-emerald-600",
      },
      { upsert: true, new: true }
    );

    return await this.getStatus(userId);
  }

  /**
   * Fetches real-time campaigns and performance metrics for the active selected account using GAQL
   * @param {string} userId
   * @param {Object} options
   * @returns {Promise<Object>}
   */
  static async getCampaigns(userId, { dateRange = "LAST_30_DAYS", limit = 50 } = {}) {
    const account = await GoogleAdsAccount.findOne({ userId }).select("+encryptedRefreshToken +encryptedAccessToken");
    if (!account) {
      throw ApiError.notFound("No Google Ads integration found. Please connect your account first.");
    }

    if (!account.selectedCustomerId) {
      throw ApiError.badRequest("No Google Ads customer account selected. Please select an active account first.");
    }

    const targetRange = VALID_DATE_RANGES.includes(dateRange.toUpperCase()) ? dateRange.toUpperCase() : "LAST_30_DAYS";
    const customerId = account.selectedCustomerId;
    const accessToken = await this.getValidAccessToken(account);

    // Following Google's Sept 2026 developer token sunset, developer-token headers
    // are obsolete. Access level is determined directly by the Google Cloud Project.
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    };

    if (account.loginCustomerId) {
      headers["login-customer-id"] = account.loginCustomerId;
    }

    // Google Ads Query Language (GAQL) query for Campaign reporting
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
      WHERE segments.date DURING ${targetRange} 
      ORDER BY metrics.impressions DESC 
      LIMIT ${Math.min(Number(limit) || 50, 100)}
    `;

    let searchResponse;
    try {
      searchResponse = await fetch(`${GOOGLE_ADS_BASE_URL}/customers/${customerId}/googleAds:search`, {
        method: "POST",
        headers,
        body: JSON.stringify({ query: gaqlQuery }),
      });
    } catch (netErr) {
      throw ApiError.internal(`Network failure fetching Google Ads campaigns: ${netErr.message}`);
    }

    if (!searchResponse.ok) {
      const err = await this.parseGoogleAdsError(searchResponse);

      if (this.isTestAccountRestrictedError(searchResponse.status, err)) {
        throw ApiError.forbidden(
          "Your Google Cloud project currently has Test access and can only query Google Ads Test Accounts. Querying live production accounts requires Explorer access (currently under review) or higher in Google Cloud Console. Please select a Test Account to continue testing."
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

    // Aggregate summary counters
    let totalSpendMicros = 0;
    let totalImpressions = 0;
    let totalClicks = 0;
    let totalConversions = 0;

    const campaigns = rows.map((row) => {
      const c = row.campaign || {};
      const m = row.metrics || {};

      const costMicros = Number(m.costMicros || 0);
      const impressions = Number(m.impressions || 0);
      const clicks = Number(m.clicks || 0);
      const conversions = Number(m.conversions || 0);
      const rawCtr = m.ctr !== undefined ? Number(m.ctr) : null;
      const avgCpcMicros = Number(m.averageCpc || 0);

      totalSpendMicros += costMicros;
      totalImpressions += impressions;
      totalClicks += clicks;
      totalConversions += conversions;

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
        cost: +(costMicros / 1000000).toFixed(2),
        costMicros,
        ctrPercent: rawCtr !== null ? +(rawCtr * 100).toFixed(2) : 0,
        averageCpc: +(avgCpcMicros / 1000000).toFixed(2),
        conversions,
        conversionsValue: m.conversionsValue ? +Number(m.conversionsValue).toFixed(2) : 0,
      };
    });

    const totalCost = +(totalSpendMicros / 1000000).toFixed(2);
    const overallCtr = totalImpressions > 0 ? +((totalClicks / totalImpressions) * 100).toFixed(2) : 0;
    const overallAvgCpc = totalClicks > 0 ? +(totalCost / totalClicks).toFixed(2) : 0;

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
      dateRange: targetRange,
      metricsSummary: {
        totalCost,
        totalImpressions,
        totalClicks,
        overallCtr,
        overallAvgCpc,
        totalConversions,
        campaignCount: campaigns.length,
      },
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
        connectedEmail: null,
        selectedAccount: null,
        accessibleCustomers: [],
        lastSyncAt: null,
      };
    }

    return {
      isConnected: account.status === "CONNECTED",
      status: account.status,
      connectedEmail: account.connectedEmail,
      selectedAccount: account.selectedCustomerId
        ? {
            id: account.selectedCustomerId,
            formattedId: this.formatCustomerId(account.selectedCustomerId),
            name: account.selectedCustomerName,
            currency: account.selectedCustomerCurrency,
            timeZone: account.selectedCustomerTimeZone,
            isManager: account.isManagerAccount,
            isTestAccount: account.isTestAccount,
          }
        : null,
      accessibleCustomers: (account.accessibleCustomers || []).map((c) => ({
        id: c.id,
        formattedId: this.formatCustomerId(c.id),
        descriptiveName: c.descriptiveName,
        currencyCode: c.currencyCode,
        timeZone: c.timeZone,
        manager: c.manager,
        testAccount: c.testAccount,
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
