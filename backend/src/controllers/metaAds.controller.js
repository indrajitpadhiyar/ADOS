import { MetaAdsService } from "../services/metaAds.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { env } from "../config/env.js";

export const MetaAdsController = {
  /**
   * GET /api/v1/meta-ads/connect
   * Generates Meta OAuth authorization URL
   */
  connect: asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { authUrl, state } = MetaAdsService.generateAuthUrl(userId);

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
   * GET /api/v1/meta-ads/auth-url
   */
  getAuthUrl: asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { authUrl, state } = MetaAdsService.generateAuthUrl(userId);

    return ApiResponse.success(res, "Meta Ads authorization URL generated successfully", {
      authUrl,
      state,
    });
  }),

  /**
   * GET & POST /api/v1/meta-ads/callback
   */
  handleCallback: asyncHandler(async (req, res) => {
    const code = req.query.code || req.body?.code;
    const state = req.query.state || req.body?.state;
    const error = req.query.error || req.body?.error;

    const isBrowserRedirect = req.method === "GET";
    const redirectBase = `${env.APP_URL}/ad-accounts`;

    if (error) {
      const errorMsg = req.query.error_description || req.query.error_reason || error || "Meta authorization was denied.";
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
        return res.redirect(`${redirectBase}?meta_ads_error=${encodeURIComponent(err.message || "Authentication_failed")}`);
      }
      throw err;
    }
  }),

  /**
   * GET /api/v1/meta-ads/status
   */
  getStatus: asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const status = await MetaAdsService.getStatus(userId);
    return ApiResponse.success(res, "Meta Ads integration status retrieved", status);
  }),

  /**
   * GET /api/v1/meta-ads/accounts
   */
  getAccounts: asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const accounts = await MetaAdsService.getAccounts(userId);
    return ApiResponse.success(res, "Accessible Meta Ad accounts retrieved", accounts);
  }),

  /**
   * POST /api/v1/meta-ads/select-account
   */
  selectAccount: asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { accountId } = req.body;
    const status = await MetaAdsService.selectAccount(userId, accountId);
    return ApiResponse.success(res, "Meta Ad account selected successfully", status);
  }),

  /**
   * GET /api/v1/meta-ads/campaigns
   */
  getCampaigns: asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { dateRange = "LAST_30_DAYS", limit = 50 } = req.query;
    const campaignsData = await MetaAdsService.getCampaigns(userId, { dateRange, limit });
    return ApiResponse.success(res, "Meta Ads campaigns retrieved", campaignsData);
  }),

  /**
   * POST & DELETE /api/v1/meta-ads/disconnect
   */
  disconnect: asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const result = await MetaAdsService.disconnect(userId);
    return ApiResponse.success(res, result.message, result);
  }),
};
