import { AuthService } from "../services/auth.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ResponseMessages } from "../constants/responseMessages.js";
import { env } from "../config/env.js";

/**
 * Cookie security options conforming to OWASP specifications
 */
const getCookieOptions = (maxAgeMs) => ({
  httpOnly: true, // Prevents client-side JavaScript access (mitigates XSS token theft)
  secure: env.NODE_ENV === "production", // Transmit only over HTTPS in production
  sameSite: env.NODE_ENV === "production" ? "strict" : "lax", // Protects against CSRF
  path: "/",
  maxAge: maxAgeMs,
});

const getClearCookieOptions = () => ({
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: env.NODE_ENV === "production" ? "strict" : "lax",
  path: "/",
});

const ACCESS_COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days (sliding session)
const REFRESH_COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days

export const AuthController = {
  /**
   * POST /api/v1/auth/register
   */
  register: asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    const { user, accessToken, refreshToken } = await AuthService.register(
      { name, email, password },
      { req }
    );

    // Set secure HTTP-only cookies
    res.cookie("accessToken", accessToken, getCookieOptions(ACCESS_COOKIE_MAX_AGE));
    res.cookie("refreshToken", refreshToken, getCookieOptions(REFRESH_COOKIE_MAX_AGE));

    return ApiResponse.created(res, "Account registered successfully!", {
      user,
      accessToken,
      refreshToken,
      requiresEmailVerification: false,
    });
  }),

  /**
   * POST /api/v1/auth/login
   */
  login: asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const result = await AuthService.login(
      { email, password },
      { req }
    );

    if (result.requiresEmailVerification) {
      return ApiResponse.success(res, result.message, {
        user: result.user,
        requiresEmailVerification: true,
      });
    }

    res.cookie("accessToken", result.accessToken, getCookieOptions(ACCESS_COOKIE_MAX_AGE));
    res.cookie("refreshToken", result.refreshToken, getCookieOptions(REFRESH_COOKIE_MAX_AGE));

    return ApiResponse.success(res, ResponseMessages.LOGIN_SUCCESS, {
      user: result.user,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });
  }),

  /**
   * POST /api/v1/auth/google
   */
  google: asyncHandler(async (req, res) => {
    const { credential, token, code, accessToken, idToken } = req.body;
    const result = await AuthService.googleAuth(
      { credential, token, code, accessToken, idToken },
      { req }
    );

    res.cookie("accessToken", result.accessToken, getCookieOptions(ACCESS_COOKIE_MAX_AGE));
    res.cookie("refreshToken", result.refreshToken, getCookieOptions(REFRESH_COOKIE_MAX_AGE));

    return ApiResponse.success(res, "Google authentication successful!", {
      user: result.user,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });
  }),

  /**
   * GET /api/v1/auth/callback & /api/v1/auth & /auth (Browser OAuth redirect callback)
   * Handles server-side OAuth redirect from Google sign-in
   */
  handleGoogleLoginCallback: asyncHandler(async (req, res) => {
    const code = req.query.code;
    const error = req.query.error;
    const rawState = req.query.state;

    // Decode state to get the origin of the frontend that started the login
    let frontendOrigin = env.APP_URL;
    if (rawState) {
      try {
        const decoded = Buffer.from(rawState, "base64").toString("utf8");
        const parsed = JSON.parse(decoded);
        if (parsed.origin) {
          frontendOrigin = parsed.origin;
        }
      } catch (e) {
        // Fallback to default APP_URL
      }
    }

    const redirectBase = `${frontendOrigin}/auth`;

    if (error) {
      const errorMsg = req.query.error_description || error || "Google sign-in was denied.";
      return res.redirect(`${redirectBase}?error=${encodeURIComponent(errorMsg)}`);
    }

    if (!code) {
      return res.redirect(`${redirectBase}?error=Missing_authorization_code`);
    }

    try {
      const host = req.get("host");
      const redirectUri = host.includes("localhost")
        ? `http://localhost:${env.PORT || 5000}/auth`
        : `https://${host}/auth`;

      const result = await AuthService.googleAuth(
        { code, redirectUri },
        { req }
      );

      res.cookie("accessToken", result.accessToken, getCookieOptions(ACCESS_COOKIE_MAX_AGE));
      res.cookie("refreshToken", result.refreshToken, getCookieOptions(REFRESH_COOKIE_MAX_AGE));

      const userParam = encodeURIComponent(
        JSON.stringify({
          id: result.user._id,
          name: result.user.name,
          email: result.user.email,
          role: result.user.role,
          avatar: result.user.avatar,
        })
      );

      return res.redirect(`${redirectBase}?loginToken=${result.accessToken}&user=${userParam}`);
    } catch (err) {
      return res.redirect(
        `${redirectBase}?error=${encodeURIComponent(err.message || "Authentication_failed")}`
      );
    }
  }),

  /**
   * POST /api/v1/auth/refresh
   */
  refreshToken: asyncHandler(async (req, res) => {
    const incomingToken = req.cookies?.refreshToken || req.body?.refreshToken;
    const { user, accessToken, refreshToken } = await AuthService.refreshAccessToken(
      incomingToken,
      { req }
    );

    res.cookie("accessToken", accessToken, getCookieOptions(ACCESS_COOKIE_MAX_AGE));
    res.cookie("refreshToken", refreshToken, getCookieOptions(REFRESH_COOKIE_MAX_AGE));

    return ApiResponse.success(res, ResponseMessages.TOKEN_REFRESH_SUCCESS, {
      user,
      accessToken,
      refreshToken,
    });
  }),

  /**
   * POST /api/v1/auth/logout
   */
  logout: asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    await AuthService.logout(userId, { req });

    // Evict session cookies with identical security attributes
    const clearOpts = getClearCookieOptions();
    res.clearCookie("accessToken", clearOpts);
    res.clearCookie("refreshToken", clearOpts);

    return ApiResponse.success(res, ResponseMessages.LOGOUT_SUCCESS, null);
  }),

  /**
   * GET /api/v1/auth/me
   */
  getMe: asyncHandler(async (req, res) => {
    const user = await AuthService.getCurrentUser(req.user._id);

    // Sliding session: renew 7-day cookie lifetime on active user visits
    if (req.cookies?.accessToken) {
      res.cookie("accessToken", req.cookies.accessToken, getCookieOptions(ACCESS_COOKIE_MAX_AGE));
    }
    if (req.cookies?.refreshToken) {
      res.cookie("refreshToken", req.cookies.refreshToken, getCookieOptions(REFRESH_COOKIE_MAX_AGE));
    }

    return ApiResponse.success(res, "User profile fetched successfully.", { user });
  }),

  /**
   * POST /api/v1/auth/forgot-password
   */
  forgotPassword: asyncHandler(async (req, res) => {
    const { email } = req.body;
    const result = await AuthService.forgotPassword(email, { req });
    return ApiResponse.success(res, result.message, null);
  }),

  /**
   * POST /api/v1/auth/reset-password
   */
  resetPassword: asyncHandler(async (req, res) => {
    const { token, password } = req.body;
    const result = await AuthService.resetPassword({ token, password }, { req });
    return ApiResponse.success(res, result.message, null);
  }),

  /**
   * POST /api/v1/auth/verify-email
   * GET  /api/v1/auth/verify-email?token=...
   */
  verifyEmail: asyncHandler(async (req, res) => {
    const token = req.body?.token || req.query?.token;
    const code = req.body?.code || req.query?.code;
    const email = req.body?.email || req.query?.email;

    const result = await AuthService.verifyEmail({ token, code, email }, { req });

    if (result.accessToken && result.refreshToken) {
      res.cookie("accessToken", result.accessToken, getCookieOptions(ACCESS_COOKIE_MAX_AGE));
      res.cookie("refreshToken", result.refreshToken, getCookieOptions(REFRESH_COOKIE_MAX_AGE));
    }

    return ApiResponse.success(res, result.message, {
      user: result.user,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      alreadyVerified: result.alreadyVerified || false,
    });
  }),

  /**
   * POST /api/v1/auth/resend-verification
   */
  resendVerification: asyncHandler(async (req, res) => {
    const { email } = req.body;
    const result = await AuthService.resendVerification(email, { req });
    return ApiResponse.success(res, result.message, null);
  }),
};
