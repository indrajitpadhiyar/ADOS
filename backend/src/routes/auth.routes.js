import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import {
  authLimiter,
  passwordResetLimiter,
  tokenRefreshLimiter,
  emailVerificationLimiter,
  resendVerificationLimiter,
} from "../middlewares/rateLimiter.middleware.js";
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyEmailSchema,
  resendVerificationSchema,
} from "../validations/auth.validation.js";

import { GoogleAdsController } from "../controllers/googleAds.controller.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const router = Router();

/**
 * Public Authentication Routes
 */
// Fallback for Google OAuth callback if redirected to the exact base URI configured in Google Cloud Console
router.get("/", (req, res, next) => {
  if (req.query.code || req.query.error) {
    return GoogleAdsController.handleCallback(req, res, next);
  }
  return ApiResponse.success(res, "ADOS Authentication API operational");
});

router.post("/register", authLimiter, validate(registerSchema), AuthController.register);
router.post("/login", authLimiter, validate(loginSchema), AuthController.login);
router.post("/google", authLimiter, AuthController.google);
router.post("/refresh", tokenRefreshLimiter, AuthController.refreshToken);
router.post("/verify-email", emailVerificationLimiter, validate(verifyEmailSchema), AuthController.verifyEmail);
router.get("/verify-email", emailVerificationLimiter, AuthController.verifyEmail);
router.post("/resend-verification", resendVerificationLimiter, validate(resendVerificationSchema), AuthController.resendVerification);
router.post("/forgot-password", passwordResetLimiter, validate(forgotPasswordSchema), AuthController.forgotPassword);
router.post("/reset-password", passwordResetLimiter, validate(resetPasswordSchema), AuthController.resetPassword);

/**
 * Protected Routes (Requires valid JWT access token)
 */
router.post("/logout", authenticate, AuthController.logout);
router.get("/me", authenticate, AuthController.getMe);

export default router;
