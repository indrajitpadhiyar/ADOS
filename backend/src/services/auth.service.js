import { User } from "../models/User.model.js";
import { PendingRegistration } from "../models/PendingRegistration.model.js";
import { ApiError } from "../utils/ApiError.js";
import { TokenUtil } from "../utils/token.util.js";
import { ResponseMessages } from "../constants/responseMessages.js";
import { SecurityLogger } from "../utils/securityLogger.util.js";
import { env } from "../config/env.js";
import { EmailService } from "./email.service.js";
import { OAuth2Client } from "google-auth-library";
import { seedInitialUserData } from "../utils/starterData.util.js";
import bcrypt from "bcryptjs";

/**
 * Enterprise Authentication Business Logic Service
 */
export const AuthService = {
  /**
   * Register a new user (Direct registration without email verification)
   * @param {Object} userData - { name, email, password }
   * @param {Object} [context] - { req }
   * @returns {Promise<{ user: Object, accessToken: string, refreshToken: string, requiresEmailVerification: boolean }>}
   */
  async register({ name, email, password }, context = {}) {
    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already exists
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      SecurityLogger.log("AUTH_REGISTER_ATTEMPT_DUPLICATE", {
        req: context.req,
        email: normalizedEmail,
        outcome: "FAILURE",
      });
      throw ApiError.conflict(ResponseMessages.EMAIL_ALREADY_EXISTS);
    }

    // Hash password with bcrypt
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user directly with verified status
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      emailVerified: true,
      isVerified: true,
    });

    // Remove any leftover pending registration if it exists
    await PendingRegistration.deleteMany({ email: normalizedEmail });

    // Generate JWTs
    const tokenPayload = { id: user._id.toString(), email: user.email, role: user.role };
    const accessToken = TokenUtil.generateAccessToken(tokenPayload);
    const refreshToken = TokenUtil.generateRefreshToken({ id: user._id.toString() });

    user.refreshToken = TokenUtil.hashToken(refreshToken);
    await user.save({ validateBeforeSave: false });

    // Seed initial MongoDB dataset for new user account
    await seedInitialUserData(user);

    SecurityLogger.log("AUTH_REGISTER_SUCCESS", {
      req: context.req,
      userId: user._id,
      email: normalizedEmail,
      outcome: "SUCCESS",
    });

    return {
      user: user.toJSON(),
      accessToken,
      refreshToken,
      requiresEmailVerification: false,
    };
  },

  /**
   * Authenticate an existing user with brute-force lockout safeguards
   * @param {Object} credentials - { email, password }
   * @param {Object} [context] - { req }
   * @returns {Promise<{ user: Object, accessToken: string, refreshToken: string }>}
   */
  async login({ email, password }, context = {}) {
    const normalizedEmail = email.toLowerCase().trim();

    // Explicitly query for +password, +loginAttempts, +lockUntil
    let user = await User.findOne({ email: normalizedEmail }).select("+password +loginAttempts +lockUntil");

    if (!user) {
      // Check if user is in PendingRegistration and auto-promote to User
      const pending = await PendingRegistration.findOne({ email: normalizedEmail });
      if (pending) {
        const isPasswordValid = await bcrypt.compare(password, pending.password);
        if (!isPasswordValid) {
          throw ApiError.unauthorized(ResponseMessages.INVALID_CREDENTIALS);
        }

        user = await User.create({
          name: pending.name,
          email: pending.email,
          password: pending.password,
          emailVerified: true,
          isVerified: true,
        });

        await PendingRegistration.deleteOne({ _id: pending._id });
      } else {
        SecurityLogger.log("AUTH_LOGIN_FAILED_USER_NOT_FOUND", {
          req: context.req,
          email: normalizedEmail,
          outcome: "FAILURE",
        });
        throw ApiError.unauthorized(ResponseMessages.INVALID_CREDENTIALS);
      }
    }

    // Check if account is locked
    if (user.isLocked()) {
      const remainingMinutes = Math.ceil((user.lockUntil.getTime() - Date.now()) / (60 * 1000));
      SecurityLogger.log("AUTH_LOGIN_REJECTED_ACCOUNT_LOCKED", {
        req: context.req,
        userId: user._id,
        email: user.email,
        outcome: "FAILURE",
      });
      throw ApiError.forbidden(
        `Account is temporarily locked due to failed attempts. Please retry in ${remainingMinutes} minute(s).`
      );
    }

    // Verify password if not already validated
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      await user.handleFailedLogin();
      SecurityLogger.log("AUTH_LOGIN_FAILED_INCORRECT_PASSWORD", {
        req: context.req,
        userId: user._id,
        email: user.email,
        outcome: "FAILURE",
      });
      throw ApiError.unauthorized(ResponseMessages.INVALID_CREDENTIALS);
    }

    // Reset login attempts on success
    await user.handleSuccessfulLogin();

    // Ensure user has verified flags active
    if (!user.emailVerified || !user.isVerified) {
      user.emailVerified = true;
      user.isVerified = true;
      await user.save({ validateBeforeSave: false });
    }

    // Generate JWTs
    const tokenPayload = { id: user._id.toString(), email: user.email, role: user.role };
    const accessToken = TokenUtil.generateAccessToken(tokenPayload);
    const refreshToken = TokenUtil.generateRefreshToken({ id: user._id.toString() });

    // Persist hashed refresh token for session tracking
    await User.updateOne({ _id: user._id }, { refreshToken: TokenUtil.hashToken(refreshToken) });

    // Ensure authentic dataset exists for this user in MongoDB
    await seedInitialUserData(user);

    SecurityLogger.log("AUTH_LOGIN_SUCCESS", {
      req: context.req,
      userId: user._id,
      email: user.email,
      outcome: "SUCCESS",
    });

    return {
      user: user.toJSON(),
      accessToken,
      refreshToken,
      requiresEmailVerification: false,
    };
  },

  /**
   * Refresh expired access token using valid refresh token with token reuse detection
   * @param {string} incomingRefreshToken
   * @param {Object} [context] - { req }
   * @returns {Promise<{ accessToken: string, refreshToken: string, user: Object }>}
   */
  async refreshAccessToken(incomingRefreshToken, context = {}) {
    if (!incomingRefreshToken) {
      throw ApiError.unauthorized("Refresh token is required.");
    }

    // 1. Verify token signature
    let decoded;
    try {
      decoded = TokenUtil.verifyRefreshToken(incomingRefreshToken);
    } catch {
      SecurityLogger.log("AUTH_TOKEN_REFRESH_INVALID_SIGNATURE", {
        req: context.req,
        outcome: "FAILURE",
      });
      throw ApiError.unauthorized(ResponseMessages.TOKEN_EXPIRED);
    }

    // 2. Find user with stored hashed refresh token
    const user = await User.findById(decoded.id).select("+refreshToken");
    if (!user || !user.refreshToken) {
      SecurityLogger.log("AUTH_TOKEN_REFRESH_USER_NOT_FOUND", {
        req: context.req,
        userId: decoded.id,
        outcome: "FAILURE",
      });
      throw ApiError.unauthorized("Invalid session token.");
    }

    // 3. Verify token hasn't been revoked/reused (Family token rotation)
    const hashedIncoming = TokenUtil.hashToken(incomingRefreshToken);
    if (hashedIncoming !== user.refreshToken) {
      // Possible token reuse attack detected: invalidate all sessions immediately
      await User.updateOne({ _id: user._id }, { $unset: { refreshToken: 1 } });
      SecurityLogger.log("AUTH_TOKEN_REUSE_ATTACK_DETECTED", {
        req: context.req,
        userId: user._id,
        email: user.email,
        outcome: "SUSPICIOUS",
      });
      throw ApiError.unauthorized("Compromised session detected. All sessions invalidated. Please log in again.");
    }

    // 4. Issue rotated tokens
    const tokenPayload = { id: user._id.toString(), email: user.email, role: user.role };
    const newAccessToken = TokenUtil.generateAccessToken(tokenPayload);
    const newRefreshToken = TokenUtil.generateRefreshToken({ id: user._id.toString() });

    await User.updateOne({ _id: user._id }, { refreshToken: TokenUtil.hashToken(newRefreshToken) });

    SecurityLogger.log("AUTH_TOKEN_REFRESH_SUCCESS", {
      req: context.req,
      userId: user._id,
      outcome: "SUCCESS",
    });

    return {
      user: user.toJSON(),
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  },

  /**
   * Terminate active user session & revoke refresh token
   * @param {string} userId
   * @param {Object} [context] - { req }
   */
  async logout(userId, context = {}) {
    if (!userId) return;
    await User.updateOne({ _id: userId }, { $unset: { refreshToken: 1 } });
    SecurityLogger.log("AUTH_LOGOUT_SUCCESS", {
      req: context.req,
      userId,
      outcome: "SUCCESS",
    });
  },

  /**
   * Fetch current authenticated user profile
   * @param {string} userId
   * @returns {Promise<Object>}
   */
  async getCurrentUser(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw ApiError.notFound("User not found.");
    }
    return user.toJSON();
  },

  /**
   * Generate password reset token (does NOT expose raw token in response or logs)
   * @param {string} email
   * @param {Object} [context] - { req }
   * @returns {Promise<{ message: string }>}
   */
  async forgotPassword(email, context = {}) {
    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    // Always return safe success message to prevent user enumeration
    if (!user) {
      SecurityLogger.log("AUTH_PASSWORD_RESET_ATTEMPT_NONEXISTENT", {
        req: context.req,
        email: normalizedEmail,
        outcome: "FAILURE",
      });
      return { message: ResponseMessages.PASSWORD_RESET_LINK_SENT };
    }

    const { hashedToken } = TokenUtil.generateCryptoToken();
    user.passwordResetToken = hashedToken;
    user.passwordResetExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 mins expiry
    await user.save({ validateBeforeSave: false });

    // Log the event securely WITHOUT the token or credentials
    SecurityLogger.log("AUTH_PASSWORD_RESET_TOKEN_GENERATED", {
      req: context.req,
      userId: user._id,
      email: user.email,
      outcome: "SUCCESS",
    });

    return {
      message: ResponseMessages.PASSWORD_RESET_LINK_SENT,
    };
  },

  /**
   * Reset password with valid reset token
   * @param {Object} params - { token, password }
   * @param {Object} [context] - { req }
   */
  async resetPassword({ token, password }, context = {}) {
    const hashedToken = TokenUtil.hashToken(token);

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    }).select("+passwordResetToken +passwordResetExpires");

    if (!user) {
      SecurityLogger.log("AUTH_PASSWORD_RESET_INVALID_TOKEN", {
        req: context.req,
        outcome: "FAILURE",
      });
      throw ApiError.badRequest("Password reset token is invalid or has expired.");
    }

    // Set new password (pre-save hook will hash it and set passwordChangedAt)
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.loginAttempts = 0;
    user.lockUntil = undefined;
    user.refreshToken = undefined; // Revoke old sessions

    await user.save();

    SecurityLogger.log("AUTH_PASSWORD_RESET_SUCCESS", {
      req: context.req,
      userId: user._id,
      email: user.email,
      outcome: "SUCCESS",
    });

    return { message: ResponseMessages.PASSWORD_RESET_SUCCESS };
  },

  /**
   * Verify email address using cryptographically secure single-use token or 6-digit code
   * @param {Object} params - { token, code, email }
   * @param {Object} [context] - { req }
   * @returns {Promise<{ message: string, user?: Object, alreadyVerified?: boolean, accessToken?: string, refreshToken?: string }>}
   */
  async verifyEmail({ token, code, email } = {}, context = {}) {
    const cleanCode = code ? String(code).trim().replace(/\D/g, "") : null;
    const cleanToken = token && typeof token === "string" ? token.trim() : null;
    const normalizedEmail = email ? email.toLowerCase().trim() : null;

    let pending = null;
    let existingUnverifiedUser = null;

    if (cleanCode && normalizedEmail) {
      const hashedCode = TokenUtil.hashToken(cleanCode);

      // 1. Check staged pending registration
      pending = await PendingRegistration.findOne({
        email: normalizedEmail,
        verificationCodeHash: hashedCode,
        expiresAt: { $gt: new Date() },
      });

      // 2. If not in pending, check unverified record in User collection
      if (!pending) {
        existingUnverifiedUser = await User.findOne({
          email: normalizedEmail,
          emailVerificationCodeHash: hashedCode,
          emailVerificationExpires: { $gt: new Date() },
        });
      }
    } else if (cleanToken) {
      const hashedToken = TokenUtil.hashToken(cleanToken);

      // 1. Check pending registration
      pending = await PendingRegistration.findOne({
        verificationTokenHash: hashedToken,
        expiresAt: { $gt: new Date() },
      });

      // 2. Check unverified record in User collection
      if (!pending) {
        existingUnverifiedUser = await User.findOne({
          emailVerificationTokenHash: hashedToken,
          emailVerificationExpires: { $gt: new Date() },
        });
      }
    } else {
      throw ApiError.badRequest("Verification token or 6-digit code with email is required.");
    }

    // Case A: Found in PendingRegistration -> promote to permanent User
    if (pending) {
      let user = await User.findOne({ email: pending.email });
      if (!user) {
        user = await User.create({
          name: pending.name,
          email: pending.email,
          password: pending.password, // Pre-hashed bcrypt string
          emailVerified: true,
          isVerified: true,
        });
      } else {
        user.emailVerified = true;
        user.isVerified = true;
        await user.save({ validateBeforeSave: false });
      }

      // Permanently remove pending registration
      await PendingRegistration.deleteOne({ _id: pending._id });

      // Issue session tokens upon successful verification so user is authenticated & ready for dashboard
      const tokenPayload = { id: user._id.toString(), email: user.email, role: user.role };
      const accessToken = TokenUtil.generateAccessToken(tokenPayload);
      const refreshToken = TokenUtil.generateRefreshToken({ id: user._id.toString() });

      user.refreshToken = TokenUtil.hashToken(refreshToken);
      await user.save({ validateBeforeSave: false });

      SecurityLogger.log("AUTH_EMAIL_VERIFICATION_SUCCESS", {
        req: context.req,
        userId: user._id,
        email: user.email,
        outcome: "SUCCESS",
      });

      return {
        message: ResponseMessages.EMAIL_VERIFIED_SUCCESS,
        user: user.toJSON(),
        accessToken,
        refreshToken,
      };
    }

    // Case B: Found in User collection (e.g. from login prompt or existing unverified account)
    if (existingUnverifiedUser) {
      existingUnverifiedUser.emailVerified = true;
      existingUnverifiedUser.isVerified = true;
      existingUnverifiedUser.emailVerificationTokenHash = undefined;
      existingUnverifiedUser.emailVerificationCodeHash = undefined;
      existingUnverifiedUser.emailVerificationExpires = undefined;

      const tokenPayload = {
        id: existingUnverifiedUser._id.toString(),
        email: existingUnverifiedUser.email,
        role: existingUnverifiedUser.role,
      };
      const accessToken = TokenUtil.generateAccessToken(tokenPayload);
      const refreshToken = TokenUtil.generateRefreshToken({ id: existingUnverifiedUser._id.toString() });

      existingUnverifiedUser.refreshToken = TokenUtil.hashToken(refreshToken);
      await existingUnverifiedUser.save({ validateBeforeSave: false });

      SecurityLogger.log("AUTH_EMAIL_VERIFICATION_SUCCESS", {
        req: context.req,
        userId: existingUnverifiedUser._id,
        email: existingUnverifiedUser.email,
        outcome: "SUCCESS",
      });

      return {
        message: ResponseMessages.EMAIL_VERIFIED_SUCCESS,
        user: existingUnverifiedUser.toJSON(),
        accessToken,
        refreshToken,
      };
    }

    // Case C: Neither found. Investigate cause for precise user feedback
    if (normalizedEmail) {
      const alreadyVerifiedUser = await User.findOne({ email: normalizedEmail });
      if (alreadyVerifiedUser && alreadyVerifiedUser.emailVerified) {
        const tokenPayload = {
          id: alreadyVerifiedUser._id.toString(),
          email: alreadyVerifiedUser.email,
          role: alreadyVerifiedUser.role,
        };
        const accessToken = TokenUtil.generateAccessToken(tokenPayload);
        const refreshToken = TokenUtil.generateRefreshToken({ id: alreadyVerifiedUser._id.toString() });

        return {
          message: ResponseMessages.EMAIL_ALREADY_VERIFIED,
          alreadyVerified: true,
          user: alreadyVerifiedUser.toJSON(),
          accessToken,
          refreshToken,
        };
      }

      // Check if registration exists but code is expired
      const expiredPending = await PendingRegistration.findOne({ email: normalizedEmail });
      if (expiredPending && expiredPending.expiresAt <= new Date()) {
        throw ApiError.badRequest("Verification code has expired. Please click Resend Code to get a fresh 6-digit code.");
      }

      const expiredUser = await User.findOne({
        email: normalizedEmail,
        emailVerificationExpires: { $lte: new Date() },
      });
      if (expiredUser) {
        throw ApiError.badRequest("Verification code has expired. Please click Resend Code to get a fresh 6-digit code.");
      }

      // If pending registration exists with valid time but code didn't match
      if (expiredPending) {
        throw ApiError.badRequest("Incorrect verification code. Please check your email and enter the latest 6-digit code.");
      }
    }

    SecurityLogger.log("AUTH_EMAIL_VERIFICATION_INVALID_CREDENTIALS", {
      req: context.req,
      outcome: "FAILURE",
    });
    throw ApiError.badRequest(ResponseMessages.VERIFICATION_TOKEN_INVALID_OR_EXPIRED);
  },

  /**
   * Resend verification email with rate limiting and account enumeration protection
   * @param {string} email
   * @param {Object} [context] - { req }
   * @returns {Promise<{ message: string }>}
   */
  async resendVerification(email, context = {}) {
    const normalizedEmail = email.toLowerCase().trim();

    // 1. If already verified in User, generic success (enumeration protection)
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser && existingUser.emailVerified) {
      SecurityLogger.log("AUTH_RESEND_VERIFICATION_ALREADY_VERIFIED", {
        req: context.req,
        userId: existingUser._id,
        email: normalizedEmail,
        outcome: "FAILURE",
      });
      return { message: ResponseMessages.RESEND_VERIFICATION_DISPATCHED };
    }

    // 2. Check PendingRegistration or unverified User
    const pending = await PendingRegistration.findOne({ email: normalizedEmail });
    const unverifiedUser = !pending ? await User.findOne({ email: normalizedEmail, emailVerified: false }) : null;

    if (!pending && !unverifiedUser) {
      SecurityLogger.log("AUTH_RESEND_VERIFICATION_NONEXISTENT", {
        req: context.req,
        email: normalizedEmail,
        outcome: "FAILURE",
      });
      return { message: ResponseMessages.RESEND_VERIFICATION_DISPATCHED };
    }

    // Generate new secure verification token and 6-digit code
    const { rawToken, hashedToken } = TokenUtil.generateCryptoToken();
    const { rawCode, hashedCode } = TokenUtil.generateVerificationCode();
    const expiresMs = env.EMAIL_VERIFICATION_EXPIRES_MINUTES * 60 * 1000;
    const recipientName = pending ? pending.name : unverifiedUser.name;
    const recipientEmail = pending ? pending.email : unverifiedUser.email;

    if (pending) {
      pending.verificationTokenHash = hashedToken;
      pending.verificationCodeHash = hashedCode;
      pending.expiresAt = new Date(Date.now() + expiresMs);
      await pending.save();
    } else if (unverifiedUser) {
      unverifiedUser.emailVerificationTokenHash = hashedToken;
      unverifiedUser.emailVerificationCodeHash = hashedCode;
      unverifiedUser.emailVerificationExpires = new Date(Date.now() + expiresMs);
      await unverifiedUser.save({ validateBeforeSave: false });
    }

    // Dispatch verification email
    const verificationUrl = `${env.APP_URL}/?verifyToken=${rawToken}`;
    const emailResult = await EmailService.sendVerificationEmail({
      to: recipientEmail,
      name: recipientName,
      verificationUrl,
      verificationCode: rawCode,
    });

    if (!emailResult.success) {
      SecurityLogger.log("AUTH_RESEND_VERIFICATION_FAILED", {
        req: context.req,
        email: recipientEmail,
        outcome: "FAILURE",
      });

      if (env.NODE_ENV === "development" && emailResult.error?.includes("only send testing emails to your own email address")) {
        console.log(`\n💡 [DEV NOTICE] Resend free sandbox restricted delivery to non-owner email.`);
        console.log(`🔑 Verification Code for ${recipientEmail}: ${rawCode}\n`);
        return { message: "Resend sandbox: code printed to server terminal for testing." };
      }

      throw ApiError.badRequest(
        "Verification email delivery failed. Please verify email settings or try again."
      );
    }

    SecurityLogger.log("AUTH_RESEND_VERIFICATION_SUCCESS", {
      req: context.req,
      email: recipientEmail,
      outcome: "SUCCESS",
    });

    return { message: ResponseMessages.RESEND_VERIFICATION_DISPATCHED };
  },

  /**
   * Google OAuth authentication handler
   * Supports Google Identity Services (GIS) ID Token credentials, Access Tokens, and Authorization Codes.
   * @param {Object} payload - { credential, token, code, accessToken, idToken }
   * @param {Object} [context] - { req }
   * @returns {Promise<{ user: Object, accessToken: string, refreshToken: string }>}
   */
  async googleAuth({ credential, token, code, accessToken, idToken }, context = {}) {
    const rawCredential = credential || token || idToken;
    let googleUser = null;

    if (rawCredential) {
      try {
        const client = new OAuth2Client(env.GOOGLE_CLIENT_ID || env.GOOGLE_ADS_CLINT_ID);
        const ticket = await client.verifyIdToken({
          idToken: rawCredential,
          audience: [env.GOOGLE_CLIENT_ID, env.GOOGLE_ADS_CLINT_ID].filter(Boolean),
        });
        googleUser = ticket.getPayload();
      } catch (verifyError) {
        // Fallback: verify directly via Google tokeninfo endpoint
        const res = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${rawCredential}`);
        if (!res.ok) {
          throw ApiError.unauthorized("Failed to verify Google identity credential.");
        }
        googleUser = await res.json();
      }
    } else if (code) {
      const client = new OAuth2Client(
        env.GOOGLE_CLIENT_ID || env.GOOGLE_ADS_CLINT_ID,
        env.GOOGLE_CLIENT_SECRET || env.GOOGLE_ADS_CLINT_SCRIPT,
        "postmessage"
      );
      try {
        const { tokens } = await client.getToken(code);
        if (tokens.id_token) {
          const ticket = await client.verifyIdToken({
            idToken: tokens.id_token,
            audience: [env.GOOGLE_CLIENT_ID, env.GOOGLE_ADS_CLINT_ID].filter(Boolean),
          });
          googleUser = ticket.getPayload();
        } else if (tokens.access_token) {
          const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
            headers: { Authorization: `Bearer ${tokens.access_token}` },
          });
          if (res.ok) googleUser = await res.json();
        }
      } catch (err) {
        throw ApiError.unauthorized("Failed to exchange Google authorization code.");
      }
    } else if (accessToken) {
      const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res.ok) {
        throw ApiError.unauthorized("Failed to fetch Google user profile with access token.");
      }
      googleUser = await res.json();
    }

    if (!googleUser || !googleUser.email) {
      throw ApiError.badRequest("Invalid Google profile response.");
    }

    const email = googleUser.email.toLowerCase().trim();
    const name = googleUser.name || email.split("@")[0];
    const avatar = googleUser.picture || null;
    const googleId = googleUser.sub || googleUser.id;

    // Check if user exists
    let user = await User.findOne({ email });

    if (user) {
      user.googleId = googleId;
      if (avatar && !user.avatar) user.avatar = avatar;
      user.emailVerified = true;
      user.isVerified = true;
      user.lastLoginAt = new Date();
      await user.save({ validateBeforeSave: false });
    } else {
      user = await User.create({
        name,
        email,
        googleId,
        avatar,
        emailVerified: true,
        isVerified: true,
        lastLoginAt: new Date(),
      });
    }

    // Seed initial MongoDB dataset for new user account
    await seedInitialUserData(user);

    // Generate JWTs
    const tokenPayload = { id: user._id.toString(), email: user.email, role: user.role };
    const jwtAccessToken = TokenUtil.generateAccessToken(tokenPayload);
    const refreshToken = TokenUtil.generateRefreshToken({ id: user._id.toString() });

    await User.updateOne({ _id: user._id }, { refreshToken: TokenUtil.hashToken(refreshToken) });

    SecurityLogger.log("AUTH_GOOGLE_SUCCESS", {
      req: context.req,
      userId: user._id,
      email: user.email,
      outcome: "SUCCESS",
    });

    return {
      user: user.toJSON(),
      accessToken: jwtAccessToken,
      refreshToken,
    };
  },
};

