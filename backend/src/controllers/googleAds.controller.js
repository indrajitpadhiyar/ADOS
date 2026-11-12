import { GoogleAdsService } from "../services/googleAds.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { env } from "../config/env.js";
import jwt from "jsonwebtoken";

export const GoogleAdsController = {
  /**
   * GET /api/v1/google-ads/connect
   * Initiates Google Ads OAuth connection for the authenticated user.
   * If requested via browser (Accept contains text/html or ?redirect=true), redirects directly to Google consent screen.
   * Otherwise returns JSON with { authUrl, state }.
   */
  connect: asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const requestedRedirectUri = req.query.redirect_uri;
    const returnUrl = req.query.return_url || req.query.returnUrl;
    const { authUrl, state, redirectUri } = GoogleAdsService.generateAuthUrl(userId, requestedRedirectUri, returnUrl);

    const acceptsHtml = req.headers.accept?.includes("text/html");
    const wantsRedirect = req.query.redirect === "true" || acceptsHtml;

    if (wantsRedirect) {
      return res.redirect(authUrl);
    }

    return ApiResponse.success(res, "Google Ads authorization URL generated successfully", {
      authUrl,
      state,
      redirectUri,
    });
  }),

  /**
   * GET /api/v1/google-ads/auth-url
   * Generates secure OAuth authorization URL for connecting Google Ads (retained for frontend compatibility)
   */
  getAuthUrl: asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const requestedRedirectUri = req.query.redirect_uri;
    const returnUrl = req.query.return_url || req.query.returnUrl;
    const { authUrl, state, redirectUri } = GoogleAdsService.generateAuthUrl(userId, requestedRedirectUri, returnUrl);

    return ApiResponse.success(res, "Google Ads authorization URL generated successfully", {
      authUrl,
      state,
      redirectUri,
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
    let redirectBase = `${env.APP_URL}/ad-accounts`;

    // Guard against legacy render domain if user has migrated to custom domain
    if (env.NODE_ENV === "production" && redirectBase.includes("ados-44jf.onrender.com")) {
      redirectBase = "https://adoshub.online/ad-accounts";
    }

    // Safely prioritize origin/returnUrl passed via cryptographic state token
    if (state) {
      try {
        const decoded = jwt.decode(state);
        if (decoded?.returnUrl) {
          const parsed = new URL(decoded.returnUrl);
          if (
            parsed.hostname === "adoshub.online" ||
            parsed.hostname === "www.adoshub.online" ||
            parsed.hostname.endsWith(".adoshub.online") ||
            parsed.hostname === "localhost" ||
            parsed.hostname === "127.0.0.1"
          ) {
            redirectBase = decoded.returnUrl.split("?")[0];
          }
        }
      } catch (e) {}
    }

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
