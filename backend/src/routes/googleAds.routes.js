import { Router } from "express";
import { GoogleAdsController } from "../controllers/googleAds.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import {
  googleAdsOAuthLimiter,
  googleAdsApiLimiter,
} from "../middlewares/rateLimiter.middleware.js";

const router = Router();

/**
 * Public OAuth Callback endpoints
 * Receives redirect from Google with authorization code and state
 */
router.get("/callback", googleAdsOAuthLimiter, GoogleAdsController.handleCallback);
router.post("/callback", googleAdsOAuthLimiter, GoogleAdsController.handleCallback);

/**
 * Protected Google Ads API endpoints (Require valid ADOS session)
 */
router.use(authenticate);

// OAuth Initiation endpoints (connect & auth-url for backward compatibility)
router.get("/connect", googleAdsOAuthLimiter, GoogleAdsController.connect);
router.get("/auth-url", googleAdsOAuthLimiter, GoogleAdsController.getAuthUrl);

// Integration status & account selection
router.get("/status", GoogleAdsController.getStatus);
router.get("/accounts", googleAdsApiLimiter, GoogleAdsController.getAccounts);
router.post("/select-account", googleAdsApiLimiter, GoogleAdsController.selectAccount);

// Read-only reporting
router.get("/campaigns", googleAdsApiLimiter, GoogleAdsController.getCampaigns);

// Disconnect endpoints (Supports both POST and DELETE for compatibility)
router.post("/disconnect", GoogleAdsController.disconnect);
router.delete("/disconnect", GoogleAdsController.disconnect);

export default router;
