import { Router } from "express";
import { AnalyticsController } from "../controllers/analytics.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authenticate);

router.get("/overview", AnalyticsController.getOverview);
router.get("/campaigns", AnalyticsController.getCampaigns);

export default router;
