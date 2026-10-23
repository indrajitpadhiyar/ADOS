import { Router } from "express";
import { AiController } from "../controllers/ai.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { aiGenerationLimiter } from "../middlewares/rateLimiter.middleware.js";

const router = Router();

// All AI generation endpoints require an authenticated user
router.use(authenticate);

// Image generation & quota endpoints
router.post("/generate-image", aiGenerationLimiter, AiController.generateImage);
router.get("/quota", AiController.getQuota);
router.get("/history", AiController.getHistory);

// Video capability status & generation attempt (honest, zero-fake)
router.get("/video-status", AiController.getVideoStatus);
router.post("/generate-video", aiGenerationLimiter, AiController.generateVideo);

export default router;
