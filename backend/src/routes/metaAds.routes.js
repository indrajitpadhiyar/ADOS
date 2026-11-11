import { Router } from "express";
import { MetaAdsController } from "../controllers/metaAds.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

// Public OAuth callback from Meta
router.get("/callback", MetaAdsController.handleCallback);
router.post("/callback", MetaAdsController.handleCallback);

// Public Meta Data Deletion Request Callback (Meta App Compliance)
router.post("/data-deletion", MetaAdsController.handleDataDeletion);
router.get("/data-deletion/status", MetaAdsController.getDataDeletionStatus);
router.get("/data-deletion", MetaAdsController.getDataDeletionStatus);

// Protected routes (JWT authenticated)
router.use(authenticate);

// Start OAuth connection & retrieve auth URL
router.get("/connect", MetaAdsController.connect);
router.get("/auth-url", MetaAdsController.getAuthUrl);
router.post("/connect-token", MetaAdsController.connectToken);

// Connection status
router.get("/status", MetaAdsController.getStatus);

// Accounts discovery & multi-account selection
router.get("/accounts", MetaAdsController.getAccounts);
router.post("/accounts/select", MetaAdsController.selectAccounts);
router.post("/select-account", MetaAdsController.selectAccounts);

// Campaign analytics
router.get("/analytics", MetaAdsController.getAnalytics);
router.get("/campaigns", MetaAdsController.getAnalytics);

// Disconnect integration
router.post("/disconnect", MetaAdsController.disconnect);
router.delete("/disconnect", MetaAdsController.disconnect);

export default router;
