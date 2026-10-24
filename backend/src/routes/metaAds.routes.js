import { Router } from "express";
import { MetaAdsController } from "../controllers/metaAds.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

// Public OAuth callback from Meta
router.get("/callback", MetaAdsController.handleCallback);
router.post("/callback", MetaAdsController.handleCallback);

// Protected routes
router.use(authenticate);

router.get("/connect", MetaAdsController.connect);
router.get("/auth-url", MetaAdsController.getAuthUrl);
router.get("/status", MetaAdsController.getStatus);
router.get("/accounts", MetaAdsController.getAccounts);
router.post("/select-account", MetaAdsController.selectAccount);
router.get("/campaigns", MetaAdsController.getCampaigns);
router.post("/disconnect", MetaAdsController.disconnect);
router.delete("/disconnect", MetaAdsController.disconnect);

export default router;
