import crypto from "node:crypto";
import { PlatformCredential } from "../models/PlatformCredential.model.js";
import { AdConnection } from "../models/AdConnection.model.js";
import { OAuthState } from "../models/OAuthState.model.js";
import { MetaAdsAccount } from "../models/MetaAdsAccount.model.js";
import { ConnectedAccount } from "../models/ConnectedAccount.model.js";
import { CryptoUtil } from "../utils/crypto.util.js";
import { ApiError } from "../utils/ApiError.js";
import { env } from "../config/env.js";

const GRAPH_VERSION = env.META_GRAPH_VERSION || "v19.0";
const GRAPH_API_BASE = `https://graph.facebook.com/${GRAPH_VERSION}`;

const DATE_PRESET_MAP = {
  today: "today",
  TODAY: "today",
  yesterday: "yesterday",
  YESTERDAY: "yesterday",
  last_7_days: "last_7d",
  LAST_7_DAYS: "last_7d",
  last_14_days: "last_14d",
  LAST_14_DAYS: "last_14d",
  last_30_days: "last_30d",
  LAST_30_DAYS: "last_30d",
  this_month: "this_month",
  THIS_MONTH: "this_month",
  last_month: "last_month",
  LAST_MONTH: "last_month",
};

export class MetaAdsService {
  /**
   * Generates Meta OAuth authorization URL with cryptographically secure random state
   * Stored in MongoDB with automatic TTL expiry and one-time use flag
   */
  static async generateAuthUrl(userId) {
    if (!env.META_APP_ID || !env.META_APP_SECRET) {
      throw ApiError.badRequest(
        "Meta App ID and Secret are not configured on the server. Please set META_APP_ID and META_APP_SECRET in backend environment variables."
      );
    }

    // Cryptographically secure random 32-byte hex state
    const state = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes TTL

    await OAuthState.create({
      state,
      userId,
      platform: "meta",
      expiresAt,
      used: false,
    });

    const authUrl = new URL(`https://www.facebook.com/${GRAPH_VERSION}/dialog/oauth`);
    authUrl.searchParams.set("client_id", env.META_APP_ID);
    authUrl.searchParams.set("redirect_uri", env.META_REDIRECT_URI);
    authUrl.searchParams.set("state", state);
    authUrl.searchParams.set("response_type", "code");

    if (env.META_LOGIN_CONFIG_ID) {
      // Official Meta Login for Business configuration
      authUrl.searchParams.set("config_id", env.META_LOGIN_CONFIG_ID);
    } else {
      // Direct scope: ads_read for pure analytics (no ads_management)
      authUrl.searchParams.set("scope", "ads_read");
    }

    return {
      authUrl: authUrl.toString(),
      state,
    };
  }

  /**
   * Validates state, exchanges authorization code for long-lived token,
   * securely encrypts and stores credentials, and discovers ad accounts.
   */
  static async handleOAuthCallback(code, state) {
    if (!state) {
      throw ApiError.badRequest("Invalid OAuth state: Missing security state parameter.");
    }

    // Server-side state validation with expiration and one-time use
    const stateRecord = await OAuthState.findOne({ state, platform: "meta" });
    if (!stateRecord) {
      throw ApiError.badRequest("Invalid or unrecognized OAuth state parameter.");
    }

    if (stateRecord.used) {
      throw ApiError.badRequest("OAuth state has already been used. Please initiate a new authorization request.");
    }

    if (stateRecord.expiresAt < new Date()) {
      throw ApiError.badRequest("OAuth state expired. Please try connecting again.");
    }

    // Mark state as consumed immediately
    stateRecord.used = true;
    await stateRecord.save();

    const userId = stateRecord.userId;

    if (!env.META_APP_ID || !env.META_APP_SECRET) {
      throw ApiError.internal("Meta credentials are not configured on the server.");
    }

    // 1. Exchange authorization code for user access token
    const tokenUrl = new URL(`${GRAPH_API_BASE}/oauth/access_token`);
    tokenUrl.searchParams.set("client_id", env.META_APP_ID);
    tokenUrl.searchParams.set("client_secret", env.META_APP_SECRET);
    tokenUrl.searchParams.set("redirect_uri", env.META_REDIRECT_URI);
    tokenUrl.searchParams.set("code", code);

    const tokenRes = await fetch(tokenUrl.toString());
    const tokenData = await tokenRes.json();

    if (!tokenRes.ok || !tokenData.access_token) {
      const errDetail = tokenData.error?.message || "Failed to exchange authorization code with Meta.";
      throw ApiError.badRequest(`Meta OAuth Error: ${errDetail}`);
    }

    let accessToken = tokenData.access_token;
    let expiresInSeconds = tokenData.expires_in || 5184000; // default 60 days

    // 2. Exchange for long-lived access token (60 days)
    try {
      const longLivedUrl = new URL(`${GRAPH_API_BASE}/oauth/access_token`);
      longLivedUrl.searchParams.set("grant_type", "fb_exchange_token");
      longLivedUrl.searchParams.set("client_id", env.META_APP_ID);
      longLivedUrl.searchParams.set("client_secret", env.META_APP_SECRET);
      longLivedUrl.searchParams.set("fb_exchange_token", accessToken);

      const longRes = await fetch(longLivedUrl.toString());
      const longData = await longRes.json();
      if (longData.access_token) {
        accessToken = longData.access_token;
        if (longData.expires_in) expiresInSeconds = longData.expires_in;
      }
    } catch {
      // Continue with initial access token if exchange fails
    }

    return this.persistConnection(userId, accessToken, expiresInSeconds);
  }

  /**
   * Discovers ad accounts and persists credentials + connections
   */
  static async persistConnection(userId, accessToken, expiresInSeconds = 5184000) {
    // 1. Fetch user profile from Meta Graph
    let metaUser = {};
    try {
      const meRes = await fetch(`${GRAPH_API_BASE}/me?fields=id,name,email&access_token=${accessToken}`);
      metaUser = await meRes.json();
    } catch {
      metaUser = {};
    }

    // 2. Discover all accessible ad accounts
    const accountsUrl = `${GRAPH_API_BASE}/me/adaccounts?fields=id,account_id,name,currency,account_status,timezone_name&access_token=${accessToken}&limit=100`;
    const accountsRes = await fetch(accountsUrl);
    const accountsData = await accountsRes.json();

    const accessible = Array.isArray(accountsData.data)
      ? accountsData.data.map((acc) => ({
          id: acc.id,
          accountId: acc.account_id || acc.id.replace("act_", ""),
          name: acc.name || `Meta Ad Account ${acc.account_id || acc.id}`,
          currency: acc.currency || "USD",
          accountStatus: acc.account_status === 1 ? "ACTIVE" : acc.account_status === 2 ? "DISABLED" : "UNCONFIRMED",
          timezoneName: acc.timezone_name || "UTC",
        }))
      : [];

    const tokenExpiry = new Date(Date.now() + expiresInSeconds * 1000);
    const encryptedToken = CryptoUtil.encrypt(accessToken);

    // 3. Upsert PlatformCredential
    await PlatformCredential.findOneAndUpdate(
      { userId, platform: "meta" },
      {
        userId,
        platform: "meta",
        encryptedAccessToken: encryptedToken,
        tokenExpiry,
        scope: "ads_read",
        metaUserId: metaUser.id || null,
        metaUserName: metaUser.name || "Meta User",
        status: "Connected",
        lastSyncedAt: new Date(),
        lastError: null,
      },
      { upsert: true, returnDocument: "after" }
    );

    // 4. Upsert AdConnection for each account while PRESERVING existing selections
    const existingConnections = await AdConnection.find({ userId, platform: "meta" }).lean();
    const existingSelectedMap = new Map();
    existingConnections.forEach((conn) => {
      existingSelectedMap.set(conn.externalAccountId, conn.selected);
    });

    const hasAnyPreviouslySelected = existingConnections.some((c) => c.selected);

    for (let i = 0; i < accessible.length; i++) {
      const acc = accessible[i];
      const actId = acc.id; // e.g. "act_2275431003028441"
      const prevSelected = existingSelectedMap.get(actId);

      // Preserve previously selected state, or auto-select first active account if no accounts were previously selected
      const isSelected = prevSelected !== undefined ? prevSelected : !hasAnyPreviouslySelected && i === 0;

      await AdConnection.findOneAndUpdate(
        { userId, platform: "meta", externalAccountId: actId },
        {
          userId,
          platform: "meta",
          externalAccountId: actId,
          accountName: acc.name,
          currency: acc.currency,
          timezone: acc.timezoneName,
          selected: isSelected,
          status: acc.accountStatus,
          lastSyncedAt: new Date(),
        },
        { upsert: true, returnDocument: "after" }
      );
    }

    // 5. Backwards compatibility sync for MetaAdsAccount & ConnectedAccount
    const selectedConn =
      (await AdConnection.findOne({ userId, platform: "meta", selected: true }).lean()) ||
      (await AdConnection.findOne({ userId, platform: "meta" }).lean());

    await MetaAdsAccount.findOneAndUpdate(
      { userId },
      {
        userId,
        encryptedAccessToken: encryptedToken,
        tokenExpiry,
        scope: "ads_read",
        metaUserId: metaUser.id || null,
        connectedName: metaUser.name || "Meta User",
        connectedEmail: metaUser.email || null,
        accessibleAccounts: accessible.map((a) => ({
          id: a.id,
          accountId: a.accountId,
          name: a.name,
          currency: a.currency,
          accountStatus: a.accountStatus === "ACTIVE" ? 1 : 2,
          timezoneName: a.timezoneName,
        })),
        selectedAccountId: selectedConn ? selectedConn.externalAccountId : null,
        selectedAccountName: selectedConn ? selectedConn.accountName : null,
        selectedAccountCurrency: selectedConn ? selectedConn.currency : "USD",
        selectedAccountTimeZone: selectedConn ? selectedConn.timezone : "UTC",
        status: "Connected",
        lastSyncAt: new Date(),
        lastError: null,
      },
      { upsert: true, returnDocument: "after" }
    );

    if (selectedConn) {
      await ConnectedAccount.findOneAndUpdate(
        { userId, platform: "meta" },
        {
          userId,
          name: selectedConn.accountName,
          accountId: selectedConn.externalAccountId.replace("act_", ""),
          platform: "meta",
          currency: selectedConn.currency === "INR" ? "INR (₹)" : `${selectedConn.currency} ($)`,
          status: "Healthy",
          lastSync: "Just now",
          iconBg: "bg-blue-600",
        },
        { upsert: true, returnDocument: "after" }
      );
    }

    return this.getStatus(userId);
  }

  /**
   * Connects via Developer / System User Access Token directly
   */
  static async connectWithToken(userId, rawToken) {
    const accessToken = (rawToken || "").trim();
    if (!accessToken) {
      throw ApiError.badRequest("Access token is required.");
    }
    return this.persistConnection(userId, accessToken, 60 * 24 * 60 * 60);
  }

  /**
   * Retrieves connection status and summary for the authenticated user
   */
  static async getStatus(userId) {
    const isConfigured = Boolean(env.META_APP_ID && env.META_APP_SECRET);

    const credential = await PlatformCredential.findOne({
      userId,
      platform: "meta",
    }).lean();

    const adConnections = await AdConnection.find({
      userId,
      platform: "meta",
    }).lean();

    if (!credential || credential.status === "Disconnected") {
      return {
        isConnected: false,
        isConfigured,
        platform: "meta",
        name: "Meta Ads (Facebook & Instagram)",
        selectedAccountIds: [],
        selectedAccountsCount: 0,
        status: "Disconnected",
        lastSyncAt: null,
        accounts: [],
      };
    }

    const isExpired = credential.tokenExpiry && new Date(credential.tokenExpiry) < new Date();
    const selectedAccounts = adConnections.filter((a) => a.selected);

    return {
      isConnected: !isExpired && credential.status === "Connected",
      isConfigured,
      platform: "meta",
      name: "Meta Ads (Facebook & Instagram)",
      metaUserName: credential.metaUserName,
      metaUserId: credential.metaUserId,
      status: isExpired ? "Expired" : credential.status,
      lastSyncAt: credential.lastSyncedAt,
      selectedAccountIds: selectedAccounts.map((a) => a.externalAccountId),
      selectedAccountsCount: selectedAccounts.length,
      totalAccountsCount: adConnections.length,
      accounts: adConnections.map((a) => ({
        id: a.externalAccountId,
        externalAccountId: a.externalAccountId,
        accountId: a.externalAccountId.replace("act_", ""),
        name: a.accountName,
        currency: a.currency,
        timezone: a.timezone,
        selected: a.selected,
        status: a.status,
        lastSyncedAt: a.lastSyncedAt,
      })),
      lastError: credential.lastError,
    };
  }

  /**
   * Returns all accessible Meta ad accounts belonging to the authenticated ADOS user
   */
  static async getAccounts(userId) {
    let connections = await AdConnection.find({ userId, platform: "meta" }).lean();

    // If none found in DB yet, try to discover if credentials exist
    if (connections.length === 0) {
      const credential = await PlatformCredential.findOne({
        userId,
        platform: "meta",
        status: "Connected",
      }).select("+encryptedAccessToken");

      if (credential) {
        const token = CryptoUtil.decrypt(credential.encryptedAccessToken);
        if (token) {
          await this.persistConnection(userId, token);
          connections = await AdConnection.find({ userId, platform: "meta" }).lean();
        }
      }
    }

    return connections.map((conn) => ({
      id: conn.externalAccountId,
      externalAccountId: conn.externalAccountId,
      accountId: conn.externalAccountId.replace("act_", ""),
      name: conn.accountName,
      currency: conn.currency,
      timezone: conn.timezone,
      selected: conn.selected,
      status: conn.status,
      lastSyncedAt: conn.lastSyncedAt,
    }));
  }

  /**
   * Accepts multiple selected account IDs and updates selection in MongoDB
   */
  static async selectAccounts(userId, accountIds = []) {
    if (!Array.isArray(accountIds)) {
      throw ApiError.badRequest("accountIds must be an array of account ID strings.");
    }

    // Normalize IDs to handle both 'act_123' and '123'
    const normalizedTargetIds = new Set(
      accountIds.map((id) => (String(id).startsWith("act_") ? String(id) : `act_${id}`))
    );

    // Verify all targeted accounts belong to the authenticated user
    const userConnections = await AdConnection.find({ userId, platform: "meta" });
    if (userConnections.length === 0) {
      throw ApiError.notFound("No Meta advertising accounts found for this user.");
    }

    // Update selections in AdConnection
    const updatePromises = userConnections.map((conn) => {
      const isSelected = normalizedTargetIds.has(conn.externalAccountId);
      conn.selected = isSelected;
      return conn.save();
    });

    await Promise.all(updatePromises);

    // Update MetaAdsAccount & ConnectedAccount with the primary selected account for overview cards
    const primarySelected =
      userConnections.find((c) => normalizedTargetIds.has(c.externalAccountId)) || userConnections[0];

    if (primarySelected) {
      await MetaAdsAccount.findOneAndUpdate(
        { userId },
        {
          selectedAccountId: primarySelected.externalAccountId,
          selectedAccountName: primarySelected.accountName,
          selectedAccountCurrency: primarySelected.currency,
          selectedAccountTimeZone: primarySelected.timezone,
          lastSyncAt: new Date(),
        }
      );

      await ConnectedAccount.findOneAndUpdate(
        { userId, platform: "meta" },
        {
          name: primarySelected.accountName,
          accountId: primarySelected.externalAccountId.replace("act_", ""),
          currency: primarySelected.currency === "INR" ? "INR (₹)" : `${primarySelected.currency} ($)`,
          lastSync: "Just now",
        }
      );
    }

    return this.getAccounts(userId);
  }

  /**
   * Fetches real campaign-level analytics from Meta Marketing API
   * Supports specific accountId or aggregates across all selected accounts
   */
  static async getAnalytics(userId, { accountId, dateRange = "last_30_days", limit = 50, since, until } = {}) {
    const credential = await PlatformCredential.findOne({
      userId,
      platform: "meta",
      status: "Connected",
    }).select("+encryptedAccessToken");

    if (!credential) {
      throw ApiError.notFound("No active Meta Ads connection found. Please connect your Meta account first.");
    }

    const accessToken = CryptoUtil.decrypt(credential.encryptedAccessToken);
    if (!accessToken) {
      throw ApiError.unauthorized("Could not decrypt Meta access token. Reauthorization required.");
    }

    // Determine target accounts
    let targetConnections = [];
    if (accountId) {
      const actId = accountId.startsWith("act_") ? accountId : `act_${accountId}`;
      const conn = await AdConnection.findOne({ userId, platform: "meta", externalAccountId: actId }).lean();
      if (!conn) {
        throw ApiError.notFound(`Meta Ad Account ${accountId} not found or unauthorized for this user.`);
      }
      targetConnections = [conn];
    } else {
      targetConnections = await AdConnection.find({ userId, platform: "meta", selected: true }).lean();
      if (targetConnections.length === 0) {
        targetConnections = await AdConnection.find({ userId, platform: "meta" }).lean();
      }
    }

    if (targetConnections.length === 0) {
      return {
        summary: {
          totalSpend: 0,
          totalImpressions: 0,
          totalClicks: 0,
          totalConversions: 0,
          totalConversionValue: 0,
          avgCpc: 0,
          ctr: 0,
          cpm: 0,
          reach: 0,
          frequency: 0,
          roas: 0,
        },
        campaigns: [],
        accounts: [],
      };
    }

    // Format date range parameter
    let dateParams = "";
    if (since && until) {
      dateParams = `time_range={'since':'${since}','until':'${until}'}`;
    } else {
      const preset = DATE_PRESET_MAP[dateRange] || "last_30d";
      dateParams = `date_preset=${preset}`;
    }

    const fields =
      "id,name,status,objective,insights." +
      dateParams +
      "{spend,impressions,clicks,cpc,ctr,cpm,reach,frequency,actions,action_values,purchase_roas}";

    const allCampaigns = [];
    let grandSpend = 0;
    let grandImpressions = 0;
    let grandClicks = 0;
    let grandConversions = 0;
    let grandConversionValue = 0;
    let grandReach = 0;

    for (const conn of targetConnections) {
      const actId = conn.externalAccountId;
      const url = `${GRAPH_API_BASE}/${actId}/campaigns?fields=${encodeURIComponent(fields)}&limit=${Math.min(
        Number(limit) || 50,
        100
      )}&access_token=${accessToken}`;

      let res;
      try {
        res = await fetch(url);
      } catch (netErr) {
        console.error(`Meta API network error on ${actId}:`, netErr.message);
        continue;
      }

      const data = await res.json();
      if (!res.ok || data.error) {
        console.warn(`Meta API error for account ${actId}:`, data.error?.message);
        credential.lastError = data.error?.message || "Failed to fetch campaigns";
        await credential.save();
        continue;
      }

      const campaigns = (data.data || []).map((c) => {
        const insight = c.insights?.data?.[0] || {};
        const spend = Number(insight.spend || 0);
        const impressions = Number(insight.impressions || 0);
        const clicks = Number(insight.clicks || 0);
        const ctr = insight.ctr ? Number(insight.ctr) : impressions > 0 ? (clicks / impressions) * 100 : 0;
        const cpc = insight.cpc ? Number(insight.cpc) : clicks > 0 ? spend / clicks : 0;
        const cpm = insight.cpm ? Number(insight.cpm) : impressions > 0 ? (spend / impressions) * 1000 : 0;
        const reach = Number(insight.reach || 0);
        const frequency = Number(insight.frequency || 0);

        let conversions = 0;
        if (Array.isArray(insight.actions)) {
          const convAction = insight.actions.find(
            (a) =>
              a.action_type === "purchase" ||
              a.action_type === "lead" ||
              a.action_type === "omni_purchase" ||
              a.action_type === "conversion"
          );
          conversions = convAction ? Number(convAction.value || 0) : 0;
        }

        let conversionValue = 0;
        if (Array.isArray(insight.action_values)) {
          const valAction = insight.action_values.find(
            (a) =>
              a.action_type === "purchase" ||
              a.action_type === "lead" ||
              a.action_type === "omni_purchase" ||
              a.action_type === "conversion"
          );
          conversionValue = valAction ? Number(valAction.value || 0) : 0;
        }

        let roas = 0;
        if (Array.isArray(insight.purchase_roas) && insight.purchase_roas.length > 0) {
          roas = Number(insight.purchase_roas[0]?.value || 0);
        } else if (spend > 0 && conversionValue > 0) {
          roas = Number((conversionValue / spend).toFixed(2));
        }

        grandSpend += spend;
        grandImpressions += impressions;
        grandClicks += clicks;
        grandConversions += conversions;
        grandConversionValue += conversionValue;
        grandReach += reach;

        return {
          id: c.id,
          campaignId: c.id,
          name: c.name,
          campaignName: c.name,
          accountId: actId,
          accountName: conn.accountName,
          platform: "meta",
          platformName: "Meta Ads",
          status: c.status?.toLowerCase() === "active" ? "Active" : "Paused",
          objective: c.objective || "OUTCOME_TRAFFIC",
          spend: Number(spend.toFixed(2)),
          impressions,
          clicks,
          ctr: Number(ctr.toFixed(2)),
          cpc: Number(cpc.toFixed(2)),
          cpm: Number(cpm.toFixed(2)),
          reach,
          frequency: Number(frequency.toFixed(2)),
          conversions,
          conversionValue: Number(conversionValue.toFixed(2)),
          roas: Number(roas.toFixed(2)),
          currency: conn.currency || "USD",
        };
      });

      allCampaigns.push(...campaigns);
    }

    const overallCtr = grandImpressions > 0 ? (grandClicks / grandImpressions) * 100 : 0;
    const overallCpc = grandClicks > 0 ? grandSpend / grandClicks : 0;
    const overallCpm = grandImpressions > 0 ? (grandSpend / grandImpressions) * 1000 : 0;
    const overallRoas = grandSpend > 0 && grandConversionValue > 0 ? grandConversionValue / grandSpend : 0;

    return {
      summary: {
        totalSpend: Number(grandSpend.toFixed(2)),
        totalImpressions: grandImpressions,
        totalClicks: grandClicks,
        totalConversions: grandConversions,
        totalConversionValue: Number(grandConversionValue.toFixed(2)),
        avgCpc: Number(overallCpc.toFixed(2)),
        ctr: Number(overallCtr.toFixed(2)),
        cpm: Number(overallCpm.toFixed(2)),
        reach: grandReach,
        frequency: grandReach > 0 ? Number((grandImpressions / grandReach).toFixed(2)) : 0,
        roas: Number(overallRoas.toFixed(2)),
        currency: targetConnections[0]?.currency || "USD",
      },
      accounts: targetConnections.map((c) => ({
        id: c.externalAccountId,
        name: c.accountName,
        currency: c.currency,
        selected: c.selected,
      })),
      campaigns: allCampaigns,
    };
  }

  /**
   * Backwards-compatible alias for getAnalytics
   */
  static async getCampaigns(userId, params) {
    const result = await this.getAnalytics(userId, params);
    return {
      accountId: result.accounts[0]?.id || null,
      accountName: result.accounts[0]?.name || null,
      currency: result.summary.currency,
      campaigns: result.campaigns,
    };
  }

  /**
   * Disconnects Meta integration, securely deleting credentials & connections
   */
  static async disconnect(userId) {
    await PlatformCredential.deleteOne({ userId, platform: "meta" });
    await AdConnection.deleteMany({ userId, platform: "meta" });
    await MetaAdsAccount.deleteOne({ userId });
    await ConnectedAccount.deleteOne({ userId, platform: "meta" });

    return {
      success: true,
      message: "Meta Ads account successfully disconnected and credentials removed.",
    };
  }
}
