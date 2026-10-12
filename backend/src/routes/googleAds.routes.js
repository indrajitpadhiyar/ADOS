import { Router } from "express";
import { GoogleAdsController } from "../controllers/googleAds.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

/**
 * Public OAuth Callback endpoints
 * Receives redirect from Google with authorization code and state
 */
router.get("/callback", GoogleAdsController.handleCallback);
router.post("/callback", GoogleAdsController.handleCallback);

/**
 * Protected Google Ads API endpoints (Require valid ADOS session)
 */
router.use(authenticate);

router.get("/auth-url", GoogleAdsController.getAuthUrl);
router.get("/status", GoogleAdsController.getStatus);
router.get("/accounts", GoogleAdsController.getAccounts);
router.post("/select-account", GoogleAdsController.selectAccount);
router.get("/campaigns", GoogleAdsController.getCampaigns);
router.post("/disconnect", GoogleAdsController.disconnect);

export default router;
