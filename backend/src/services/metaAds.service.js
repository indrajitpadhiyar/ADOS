import { MetaAdsAccount } from "../models/MetaAdsAccount.model.js";
import { ConnectedAccount } from "../models/ConnectedAccount.model.js";
import { CryptoUtil } from "../utils/crypto.util.js";
import { ApiError } from "../utils/ApiError.js";
import { env } from "../config/env.js";

const GRAPH_API_BASE = "https://graph.facebook.com/v19.0";

const DATE_PRESET_MAP = {
  TODAY: "today",
  YESTERDAY: "yesterday",
  LAST_7_DAYS: "last_7d",
  LAST_14_DAYS: "last_14d",
  LAST_30_DAYS: "last_30d",
  THIS_MONTH: "this_month",
  LAST_MONTH: "last_month",
  today: "today",
  yesterday: "yesterday",
  last_7_days: "last_7d",
  last_14_days: "last_14d",
  last_30_days: "last_30d",
  this_month: "this_month",
  last_month: "last_month",
};

export class MetaAdsService {
  /**
   * Generates Meta OAuth authorization URL
   */
  static generateAuthUrl(userId) {
    if (!env.META_APP_ID || !env.META_APP_SECRET) {
      throw ApiError.badRequest(
        "Meta App ID and Secret are not configured on the server. Please set META_APP_ID and META_APP_SECRET in the backend environment variables."
      );
    }

    const statePayload = JSON.stringify({
      userId: userId.toString(),
      timestamp: Date.now(),
    });

    const state = CryptoUtil.encrypt(statePayload);

    const authUrl = new URL("https://www.facebook.com/v19.0/dialog/oauth");
    authUrl.searchParams.set("client_id", env.META_APP_ID);
    authUrl.searchParams.set("redirect_uri", env.META_REDIRECT_URI);
    authUrl.searchParams.set("state", state);
    authUrl.searchParams.set("scope", "ads_read,read_insights");
    authUrl.searchParams.set("response_type", "code");

    return {
      authUrl: authUrl.toString(),
      state,
    };
  }

  /**
   * Validates state and exchanges authorization code for long-lived access token
   */
  static async handleOAuthCallback(code, state) {
    if (!state) {
      throw ApiError.badRequest("Invalid OAuth state: Missing security state parameter.");
    }

    let parsedState;
    try {
      const decrypted = CryptoUtil.decrypt(state);
      parsedState = JSON.parse(decrypted);
    } catch {
      throw ApiError.badRequest("Invalid or tampered OAuth state parameter.");
    }

    const { userId, timestamp } = parsedState;
    if (!userId || !timestamp || Date.now() - timestamp > 15 * 60 * 1000) {
      throw ApiError.badRequest("OAuth state expired or invalid. Please try connecting again.");
    }

    if (!env.META_APP_ID || !env.META_APP_SECRET) {
      throw ApiError.internal("Meta credentials not configured on the server.");
    }

    // 1. Exchange authorization code for short-lived user access token
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
    let expiresInSeconds = tokenData.expires_in || 5184000; // default ~60 days

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
      // Continue with current access token
    }

    // 3. Fetch user profile from Meta Graph
    let metaUser = {};
    try {
      const meRes = await fetch(`${GRAPH_API_BASE}/me?fields=id,name,email&access_token=${accessToken}`);
      metaUser = await meRes.json();
    } catch {
      metaUser = {};
    }

    // 4. Fetch accessible ad accounts
    const accountsUrl = `${GRAPH_API_BASE}/me/adaccounts?fields=id,account_id,name,currency,account_status,timezone_name&access_token=${accessToken}`;
    const accountsRes = await fetch(accountsUrl);
    const accountsData = await accountsRes.json();

    const accessible = Array.isArray(accountsData.data)
      ? accountsData.data.map((acc) => ({
          id: acc.id,
          accountId: acc.account_id || acc.id.replace("act_", ""),
          name: acc.name || `Meta Ad Account ${acc.account_id || acc.id}`,
          currency: acc.currency || "USD",
          accountStatus: acc.account_status ?? 1,
          timezoneName: acc.timezone_name || "UTC",
        }))
      : [];

    const defaultAccount = accessible.find((a) => a.accountStatus === 1) || accessible[0] || null;

    const tokenExpiry = new Date(Date.now() + expiresInSeconds * 1000);
    const encryptedToken = CryptoUtil.encrypt(accessToken);

    // 5. Upsert MetaAdsAccount for user
    const metaAccount = await MetaAdsAccount.findOneAndUpdate(
      { userId },
      {
        userId,
        encryptedAccessToken: encryptedToken,
        tokenExpiry,
        scope: "ads_read,read_insights",
        metaUserId: metaUser.id || null,
        connectedName: metaUser.name || null,
        connectedEmail: metaUser.email || null,
        accessibleAccounts: accessible,
        selectedAccountId: defaultAccount ? defaultAccount.id : null,
        selectedAccountName: defaultAccount ? defaultAccount.name : null,
        selectedAccountCurrency: defaultAccount ? defaultAccount.currency : "USD",
        selectedAccountTimeZone: defaultAccount ? defaultAccount.timezoneName : "UTC",
        status: "Connected",
        lastSyncAt: new Date(),
        lastError: null,
      },
      { upsert: true, new: true }
    );

    // 6. Sync with ConnectedAccount
    if (defaultAccount) {
      await ConnectedAccount.findOneAndUpdate(
        { userId, platform: "meta" },
        {
          userId,
          name: defaultAccount.name,
          accountId: defaultAccount.accountId,
          platform: "meta",
          currency: defaultAccount.currency === "INR" ? "INR (₹)" : `${defaultAccount.currency} ($)`,
          status: "Healthy",
          lastSync: "Just now",
          iconBg: "bg-blue-600",
        },
        { upsert: true, new: true }
      );
    }

    return this.getStatus(userId);
  }

  /**
   * Retrieves connection status for the authenticated user
   */
  static async getStatus(userId) {
    const isConfigured = Boolean(env.META_APP_ID && env.META_APP_SECRET);

    const account = await MetaAdsAccount.findOne({ userId });
    if (!account || account.status === "Disconnected") {
      return {
        isConnected: false,
        isConfigured,
        platform: "meta",
        name: "Meta Ads (Facebook & Instagram)",
        selectedAccountId: null,
        selectedAccountName: null,
        selectedAccountCurrency: null,
        status: "Disconnected",
        lastSyncAt: null,
        accessibleAccounts: [],
      };
    }

    const isExpired = account.tokenExpiry && new Date(account.tokenExpiry) < new Date();

    return {
      isConnected: !isExpired && account.status === "Connected",
      isConfigured,
      platform: "meta",
      name: "Meta Ads (Facebook & Instagram)",
      connectedEmail: account.connectedEmail,
      connectedName: account.connectedName,
      selectedAccountId: account.selectedAccountId,
      selectedAccountName: account.selectedAccountName,
      selectedAccountCurrency: account.selectedAccountCurrency,
      status: isExpired ? "Expired" : account.status,
      lastSyncAt: account.lastSyncAt,
      accessibleAccounts: account.accessibleAccounts,
      lastError: account.lastError,
    };
  }

  /**
   * Retrieves fresh list of accessible ad accounts from Meta Graph
   */
  static async getAccounts(userId) {
    const account = await MetaAdsAccount.findOne({ userId }).select("+encryptedAccessToken");
    if (!account) {
      throw ApiError.notFound("No Meta Ads connection found for this user.");
    }

    const accessToken = CryptoUtil.decrypt(account.encryptedAccessToken);
    if (!accessToken) {
      throw ApiError.unauthorized("Could not decrypt Meta access token. Reauthorization required.");
    }

    try {
      const url = `${GRAPH_API_BASE}/me/adaccounts?fields=id,account_id,name,currency,account_status,timezone_name&access_token=${accessToken}`;
      const res = await fetch(url);
      const data = await res.json();

      if (data.data && Array.isArray(data.data)) {
        const accessible = data.data.map((acc) => ({
          id: acc.id,
          accountId: acc.account_id || acc.id.replace("act_", ""),
          name: acc.name || `Meta Ad Account ${acc.account_id || acc.id}`,
          currency: acc.currency || "USD",
          accountStatus: acc.account_status ?? 1,
          timezoneName: acc.timezone_name || "UTC",
        }));

        account.accessibleAccounts = accessible;
        account.lastSyncAt = new Date();
        await account.save();
        return accessible;
      }

      if (data.error) {
        throw new Error(data.error.message || "Meta API error");
      }
    } catch (err) {
      // Fallback to cached accessible accounts
    }

    return account.accessibleAccounts;
  }

  /**
   * Selects an ad account to synchronize
   */
  static async selectAccount(userId, accountId) {
    if (!accountId) {
      throw ApiError.badRequest("Account ID is required.");
    }

    const account = await MetaAdsAccount.findOne({ userId });
    if (!account) {
      throw ApiError.notFound("No Meta Ads connection found.");
    }

    const matched = account.accessibleAccounts.find(
      (a) => a.id === accountId || a.accountId === accountId.replace("act_", "")
    );

    const selectedId = matched ? matched.id : accountId.startsWith("act_") ? accountId : `act_${accountId}`;
    const selectedName = matched?.name || `Meta Account (${selectedId})`;
    const selectedCurrency = matched?.currency || "USD";
    const selectedTimeZone = matched?.timezoneName || "UTC";

    account.selectedAccountId = selectedId;
    account.selectedAccountName = selectedName;
    account.selectedAccountCurrency = selectedCurrency;
    account.selectedAccountTimeZone = selectedTimeZone;
    account.lastSyncAt = new Date();
    await account.save();

    await ConnectedAccount.findOneAndUpdate(
      { userId, platform: "meta" },
      {
        userId,
        name: selectedName,
        accountId: selectedId.replace("act_", ""),
        platform: "meta",
        currency: selectedCurrency === "INR" ? "INR (₹)" : `${selectedCurrency} ($)`,
        status: "Healthy",
        lastSync: "Just now",
        iconBg: "bg-blue-600",
      },
      { upsert: true, new: true }
    );

    return this.getStatus(userId);
  }

  /**
   * Fetches real campaign insights from Meta Marketing API
   */
  static async getCampaigns(userId, { dateRange = "LAST_30_DAYS", limit = 50 } = {}) {
    const account = await MetaAdsAccount.findOne({ userId }).select("+encryptedAccessToken");
    if (!account || account.status === "Disconnected") {
      throw ApiError.notFound("No active Meta Ads connection found. Please connect your Meta account first.");
    }

    if (!account.selectedAccountId) {
      throw ApiError.badRequest("No Meta Ad Account selected. Please select an active account first.");
    }

    const accessToken = CryptoUtil.decrypt(account.encryptedAccessToken);
    if (!accessToken) {
      throw ApiError.unauthorized("Could not decrypt Meta access token. Please reconnect.");
    }

    const preset = DATE_PRESET_MAP[dateRange] || "last_30d";
    const accountActId = account.selectedAccountId.startsWith("act_")
      ? account.selectedAccountId
      : `act_${account.selectedAccountId}`;

    const fields = "id,name,status,objective,insights.date_preset(" + preset + "){spend,impressions,clicks,cpc,ctr,cpm,actions,action_values,purchase_roas}";
    const url = `${GRAPH_API_BASE}/${accountActId}/campaigns?fields=${encodeURIComponent(fields)}&limit=${Math.min(Number(limit) || 50, 100)}&access_token=${accessToken}`;

    let res;
    try {
      res = await fetch(url);
    } catch (netErr) {
      throw ApiError.internal(`Network failure querying Meta Marketing API: ${netErr.message}`);
    }

    const data = await res.json();
    if (!res.ok || data.error) {
      const msg = data.error?.message || "Failed to fetch campaigns from Meta Marketing API.";
      account.lastError = msg;
      await account.save();
      throw ApiError.badRequest(`Meta API Error: ${msg}`);
    }

    const campaigns = (data.data || []).map((c) => {
      const insight = c.insights?.data?.[0] || {};
      const spend = Number(insight.spend || 0);
      const impressions = Number(insight.impressions || 0);
      const clicks = Number(insight.clicks || 0);
      const ctr = insight.ctr ? Number(insight.ctr) : impressions > 0 ? (clicks / impressions) * 100 : 0;
      const cpc = insight.cpc ? Number(insight.cpc) : clicks > 0 ? spend / clicks : 0;

      let conversions = 0;
      if (Array.isArray(insight.actions)) {
        const convAction = insight.actions.find(
          (a) => a.action_type === "purchase" || a.action_type === "lead" || a.action_type === "omni_purchase" || a.action_type === "conversion"
        );
        conversions = convAction ? Number(convAction.value || 0) : 0;
      }

      let roas = 0;
      if (Array.isArray(insight.purchase_roas) && insight.purchase_roas.length > 0) {
        roas = Number(insight.purchase_roas[0]?.value || 0);
      }

      return {
        id: c.id,
        name: c.name,
        platform: "meta",
        platformName: "Meta Ads",
        status: c.status?.toLowerCase() === "active" ? "Active" : "Paused",
        spend,
        impressions,
        clicks,
        ctr: Number(ctr.toFixed(2)),
        cpc: Number(cpc.toFixed(2)),
        conversions,
        roas: Number(roas.toFixed(2)),
        currency: account.selectedCustomerCurrency || "USD",
      };
    });

    return {
      accountId: accountActId,
      accountName: account.selectedAccountName,
      currency: account.selectedAccountCurrency,
      campaigns,
    };
  }

  /**
   * Disconnects Meta Ads account
   */
  static async disconnect(userId) {
    await MetaAdsAccount.deleteOne({ userId });
    await ConnectedAccount.deleteOne({ userId, platform: "meta" });
    return { success: true, message: "Meta Ads account successfully disconnected." };
  }
}
