import { MetaAdsService } from "../services/metaAds.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { env } from "../config/env.js";

export const MetaAdsController = {
  /**
   * GET /api/v1/meta/connect & /api/v1/meta-ads/connect
   * Starts Meta authorization for the authenticated ADOS user
   */
  connect: asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { authUrl, state } = await MetaAdsService.generateAuthUrl(userId);

    const acceptsHtml = req.headers.accept?.includes("text/html");
    const wantsRedirect = req.query.redirect === "true" || acceptsHtml;

    if (wantsRedirect) {
      return res.redirect(authUrl);
    }

    return ApiResponse.success(res, "Meta Ads authorization URL generated successfully", {
      authUrl,
      state,
    });
  }),

  /**
   * GET /api/v1/meta/auth-url & /api/v1/meta-ads/auth-url
   */
  getAuthUrl: asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { authUrl, state } = await MetaAdsService.generateAuthUrl(userId);

    return ApiResponse.success(res, "Meta Ads authorization URL generated successfully", {
      authUrl,
      state,
    });
  }),

  /**
   * POST /api/v1/meta/connect-token & /api/v1/meta-ads/connect-token
   * Connects via Developer / System User Access Token directly
   */
  connectToken: asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { accessToken } = req.body;
    if (!accessToken) {
      throw ApiError.badRequest("Meta Access Token is required.");
    }
    const status = await MetaAdsService.connectWithToken(userId, accessToken);
    return ApiResponse.success(res, "Meta Ads connected successfully with access token", status);
  }),

  /**
   * GET & POST /api/v1/meta/callback & /api/v1/meta-ads/callback
   * Handles Meta OAuth callback, validates state, exchanges authorization code,
   * securely stores credentials, and discovers advertising accounts.
   */
  handleCallback: asyncHandler(async (req, res) => {
    const code = req.query.code || req.body?.code;
    const state = req.query.state || req.body?.state;
    const error = req.query.error || req.body?.error;

    const isBrowserRedirect = req.method === "GET";
    const redirectBase = `${env.APP_URL}/ad-accounts`;

    if (error) {
      const errorMsg =
        req.query.error_description || req.query.error_reason || error || "Meta authorization was denied.";
      if (isBrowserRedirect) {
        return res.redirect(`${redirectBase}?meta_ads_error=${encodeURIComponent(errorMsg)}`);
      }
      throw ApiError.badRequest(errorMsg);
    }

    if (!code) {
      if (isBrowserRedirect) {
        return res.redirect(`${redirectBase}?meta_ads_error=Missing_authorization_code`);
      }
      throw ApiError.badRequest("Authorization code is required.");
    }

    try {
      const status = await MetaAdsService.handleOAuthCallback(code, state);

      if (isBrowserRedirect) {
        return res.redirect(`${redirectBase}?meta_ads_success=true`);
      }

      return ApiResponse.success(res, "Meta Ads account successfully connected!", status);
    } catch (err) {
      if (isBrowserRedirect) {
        return res.redirect(
          `${redirectBase}?meta_ads_error=${encodeURIComponent(err.message || "Authentication_failed")}`
        );
      }
      throw err;
    }
  }),

  /**
   * GET /api/v1/meta/status & /api/v1/meta-ads/status
   */
  getStatus: asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const status = await MetaAdsService.getStatus(userId);
    return ApiResponse.success(res, "Meta Ads integration status retrieved", status);
  }),

  /**
   * GET /api/v1/meta/accounts & /api/v1/meta-ads/accounts
   * Returns all accessible Meta ad accounts belonging to the authenticated ADOS user.
   */
  getAccounts: asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const accounts = await MetaAdsService.getAccounts(userId);
    return ApiResponse.success(res, "Accessible Meta Ad accounts retrieved", accounts);
  }),

  /**
   * POST /api/v1/meta/accounts/select & /api/v1/meta-ads/select-account
   * Accepts selected account IDs and saves their selection in MongoDB.
   */
  selectAccounts: asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { accountIds, accountId } = req.body;

    const targetIds = Array.isArray(accountIds)
      ? accountIds
      : accountId
      ? [accountId]
      : [];

    const accounts = await MetaAdsService.selectAccounts(userId, targetIds);
    return ApiResponse.success(res, "Meta Ad accounts selection updated successfully", accounts);
  }),

  /**
   * GET /api/v1/meta/analytics & /api/v1/meta-ads/campaigns
   * Returns campaign-level analytics for a selected account and date range.
   */
  getAnalytics: asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { accountId, dateRange = "last_30_days", limit = 50, since, until } = req.query;

    const analyticsData = await MetaAdsService.getAnalytics(userId, {
      accountId,
      dateRange,
      limit,
      since,
      until,
    });

    return ApiResponse.success(res, "Meta Ads analytics retrieved successfully", analyticsData);
  }),

  /**
   * POST & DELETE /api/v1/meta/disconnect & /api/v1/meta-ads/disconnect
   * Disconnects the user's Meta integration and securely removes associated credentials.
   */
  disconnect: asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const result = await MetaAdsService.disconnect(userId);
    return ApiResponse.success(res, result.message, result);
  }),
};
