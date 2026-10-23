import rateLimit from "express-rate-limit";
import { HttpStatus } from "../constants/httpStatus.js";
import { ResponseMessages } from "../constants/responseMessages.js";

const createLimiter = (windowMs, max, message) =>
  rateLimit({
    windowMs,
    max,
    standardHeaders: true, // Return standard `RateLimit-*` headers
    legacyHeaders: false, // Disable non-standard `X-RateLimit-*`
    handler: (req, res) => {
      res.status(HttpStatus.TOO_MANY_REQUESTS).json({
        success: false,
        statusCode: HttpStatus.TOO_MANY_REQUESTS,
        message: message || ResponseMessages.TOO_MANY_REQUESTS,
      });
    },
  });

/**
 * Sensitive Authentication Endpoint Rate Limiter (Login, Register)
 * Guards against brute-force password cracking and credential stuffing.
 */
export const authLimiter = createLimiter(
  15 * 60 * 1000, // 15 minutes
  15, // 15 requests per 15-minute window
  "Too many authentication attempts. Please try again in 15 minutes."
);

/**
 * Strict Password Recovery Limiter
 * Mitigates email flooding and reset token enumeration
 */
export const passwordResetLimiter = createLimiter(
  15 * 60 * 1000,
  5, // 5 requests per 15 minutes
  "Too many password reset requests. Please wait 15 minutes before requesting again."
);

/**
 * Token Refresh Rate Limiter
 */
export const tokenRefreshLimiter = createLimiter(
  15 * 60 * 1000,
  30, // 30 refresh requests per 15 minutes
  "Too many token refresh attempts. Please re-authenticate."
);

/**
 * Strict Email Verification Resend Limiter
 * Mitigates email spamming, token generation abuse, and rate limits resend requests
 */
export const resendVerificationLimiter = createLimiter(
  15 * 60 * 1000,
  3, // 3 requests per 15 minutes per IP
  "Too many verification resend attempts. Please check your inbox or wait 15 minutes."
);

/**
 * Email Verification Endpoint Rate Limiter
 * Guards against automated verification token guessing and timing attacks
 */
export const emailVerificationLimiter = createLimiter(
  15 * 60 * 1000,
  15, // 15 verification attempts per 15 minutes
  "Too many verification attempts. Please try again later."
);

/**
 * General API Rate Limiter
 */
export const apiLimiter = createLimiter(
  15 * 60 * 1000,
  300, // 300 requests per 15 minutes
  ResponseMessages.TOO_MANY_REQUESTS
);

/**
 * Google Ads OAuth Authorization Limiter (Connect, Auth URL, Callback)
 */
export const googleAdsOAuthLimiter = createLimiter(
  15 * 60 * 1000,
  20,
  "Too many Google Ads authorization requests. Please try again in 15 minutes."
);

/**
 * Google Ads Operations & Sync Limiter (Accounts discovery, campaigns query)
 * Protects server and prevents Google Ads API quota exhaustion
 */
export const googleAdsApiLimiter = createLimiter(
  15 * 60 * 1000,
  60,
  "Too many Google Ads API sync requests. Please try again shortly."
);
