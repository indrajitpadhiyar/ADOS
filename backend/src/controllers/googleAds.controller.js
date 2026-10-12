import { GoogleAdsService } from "../services/googleAds.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { env } from "../config/env.js";

export const GoogleAdsController = {
  /**
   * GET /api/v1/google-ads/auth-url
   * Generates secure OAuth authorization URL for connecting Google Ads
   */
  getAuthUrl: asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { authUrl, state } = GoogleAdsService.generateAuthUrl(userId);

    return ApiResponse.success(res, "Google Ads authorization URL generated successfully", {
      authUrl,
      state,
    });
  }),

  /**
   * GET or POST /api/v1/google-ads/callback (and fallback at /api/v1/auth)
   * Handles OAuth callback from Google Identity server
   */
  handleCallback: asyncHandler(async (req, res) => {
    const code = req.query.code || req.body?.code;
    const state = req.query.state || req.body?.state;
    const error = req.query.error || req.body?.error;

    // Check if this was a browser redirect GET request
    const isBrowserRedirect = req.method === "GET";
    const redirectBase = `${env.APP_URL}/manage-account`;

    if (error) {
      const errorMsg = req.query.error_description || error || "Google authorization was denied or cancelled.";
      if (isBrowserRedirect) {
        return res.redirect(`${redirectBase}?google_ads_error=${encodeURIComponent(errorMsg)}`);
      }
      throw ApiError.badRequest(errorMsg);
    }

    if (!code) {
      if (isBrowserRedirect) {
        return res.redirect(`${redirectBase}?google_ads_error=Missing_authorization_code`);
      }
      throw ApiError.badRequest("Authorization code is required.");
    }

    try {
      const status = await GoogleAdsService.handleOAuthCallback(code, state);

      if (isBrowserRedirect) {
        return res.redirect(`${redirectBase}?google_ads_success=true`);
      }

      return ApiResponse.success(res, "Google Ads account successfully connected!", status);
    } catch (err) {
      if (isBrowserRedirect) {
        return res.redirect(`${redirectBase}?google_ads_error=${encodeURIComponent(err.message || "Authentication_failed")}`);
      }
      throw err;
    }
  }),

  /**
   * GET /api/v1/google-ads/status
   * Retrieves connection status and selected account information
   */
  getStatus: asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const status = await GoogleAdsService.getStatus(userId);

    return ApiResponse.success(res, "Google Ads integration status retrieved", status);
  }),

  /**
   * GET /api/v1/google-ads/accounts
   * Discovers and retrieves all accessible Google Ads accounts
   */
  getAccounts: asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const accounts = await GoogleAdsService.syncAccessibleCustomers(userId);

    return ApiResponse.success(res, "Accessible Google Ads accounts synchronized successfully", accounts);
  }),

  /**
   * POST /api/v1/google-ads/select-account
   * Selects an active Google Ads account for reporting
   */
  selectAccount: asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { customerId, managerId } = req.body;

    if (!customerId) {
      throw ApiError.badRequest("Customer account ID is required.");
    }

    const updatedStatus = await GoogleAdsService.selectCustomerAccount(userId, customerId, managerId);

    return ApiResponse.success(res, "Google Ads active account updated successfully", updatedStatus);
  }),

  /**
   * GET /api/v1/google-ads/campaigns
   * Fetches real-time campaigns and performance metrics via GAQL
   */
  getCampaigns: asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { dateRange = "LAST_30_DAYS", limit = 50 } = req.query;

    const data = await GoogleAdsService.getCampaigns(userId, { dateRange, limit });

    return ApiResponse.success(res, "Google Ads campaigns retrieved successfully", data);
  }),

  /**
   * POST /api/v1/google-ads/disconnect
   * Safely disconnects the Google Ads integration and revokes tokens
   */
  disconnect: asyncHandler(async (req, res) => {
    const userId = req.user._id;
    await GoogleAdsService.disconnect(userId);

    return ApiResponse.success(res, "Google Ads account disconnected successfully", {
      isConnected: false,
    });
  }),
};
