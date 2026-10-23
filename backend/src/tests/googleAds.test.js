import { test, describe } from "node:test";
import assert from "node:assert/strict";
import jwt from "jsonwebtoken";
import crypto from "node:crypto";
import { env } from "../config/env.js";
import { CryptoUtil } from "../utils/crypto.util.js";
import { GoogleAdsService } from "../services/googleAds.service.js";
import { GoogleAdsAccount } from "../models/GoogleAdsAccount.model.js";

describe("Google Ads OAuth Integration Test Suite", () => {
  describe("1. Anti-CSRF OAuth State Token Security", () => {
    const mockUserId = "507f1f77bcf86cd799439011";

    test("generates a signed JWT state token containing userId, purpose, and nonce", () => {
      const { authUrl, state } = GoogleAdsService.generateAuthUrl(mockUserId);

      assert.ok(authUrl, "authUrl should be generated");
      assert.ok(authUrl.startsWith("https://accounts.google.com/o/oauth2/v2/auth"), "Must use Google OAuth auth URL");
      assert.ok(state, "state should be generated");

      const decoded = jwt.verify(state, env.JWT_ACCESS_SECRET);
      assert.equal(decoded.userId, mockUserId);
      assert.equal(decoded.purpose, "google_ads_oauth");
      assert.ok(decoded.jti, "state must contain unique cryptographic nonce (jti)");
      assert.equal(decoded.redirectUri, env.GOOGLE_ADS_REDIRECT_URI);
    });

    test("rejects state tokens with wrong purpose", () => {
      const forgedState = jwt.sign(
        { userId: mockUserId, purpose: "user_login" },
        env.JWT_ACCESS_SECRET,
        { expiresIn: "15m" }
      );

      assert.rejects(
        async () => {
          await GoogleAdsService.handleOAuthCallback("fake_code", forgedState);
        },
        /Invalid or expired OAuth state parameter/
      );
    });

    test("rejects state tokens signed with wrong secret", () => {
      const tamperedState = jwt.sign(
        { userId: mockUserId, purpose: "google_ads_oauth" },
        "wrong_unauthorized_secret_key_123456",
        { expiresIn: "15m" }
      );

      assert.rejects(
        async () => {
          await GoogleAdsService.handleOAuthCallback("fake_code", tamperedState);
        },
        /Invalid or expired OAuth state parameter/
      );
    });

    test("rejects expired state tokens", () => {
      const expiredState = jwt.sign(
        { userId: mockUserId, purpose: "google_ads_oauth" },
        env.JWT_ACCESS_SECRET,
        { expiresIn: "-1s" }
      );

      assert.rejects(
        async () => {
          await GoogleAdsService.handleOAuthCallback("fake_code", expiredState);
        },
        /Invalid or expired OAuth state parameter/
      );
    });
  });

  describe("2. AES-256-GCM Token Encryption & Dual-Key Compatibility", () => {
    test("encrypts and decrypts credentials accurately", () => {
      const secretToken = "1//04test_google_ads_refresh_token_xyz_987654";
      const encrypted = CryptoUtil.encrypt(secretToken);

      assert.ok(encrypted);
      const parts = encrypted.split(":");
      assert.equal(parts.length, 3, "Payload format must be iv:authTag:ciphertext");

      const decrypted = CryptoUtil.decrypt(encrypted);
      assert.equal(decrypted, secretToken, "Decrypted token must exactly match original plaintext");
    });

    test("detects tampered ciphertext and rejects decryption (AEAD authentication tag)", () => {
      const secretToken = "sensitive_refresh_token_to_tamper";
      const encrypted = CryptoUtil.encrypt(secretToken);
      const [iv, tag, cipher] = encrypted.split(":");

      // Modify the last character of the ciphertext
      const tamperedCipher = cipher.slice(0, -2) + (cipher.endsWith("a") ? "b" : "a");
      const tamperedPayload = `${iv}:${tag}:${tamperedCipher}`;

      assert.throws(
        () => CryptoUtil.decrypt(tamperedPayload),
        /Failed to decrypt secure credential/
      );
    });

    test("preserves backward compatibility: decrypts ciphertext created with legacy secret", () => {
      // Create a payload explicitly using the legacy key formula (derived from COOKIE_SECRET)
      const legacySecret = env.COOKIE_SECRET || env.JWT_ACCESS_SECRET || "ados_default_secure_vault_key_2026";
      const legacyKey = crypto.createHash("sha256").update(legacySecret).digest();

      const samplePlaintext = "1//legacy_refresh_token_from_production";
      const iv = crypto.randomBytes(12);
      const cipher = crypto.createCipheriv("aes-256-gcm", legacyKey, iv);
      let encrypted = cipher.update(samplePlaintext, "utf8", "hex");
      encrypted += cipher.final("hex");
      const authTag = cipher.getAuthTag();
      const legacyPayload = `${iv.toString("hex")}:${authTag.toString("hex")}:${encrypted}`;

      // Decrypt using CryptoUtil
      const decrypted = CryptoUtil.decrypt(legacyPayload);
      assert.equal(decrypted, samplePlaintext, "Legacy payload must decrypt cleanly without data loss");
    });
  });

  describe("3. Google Ads Customer ID Formatting and Sanitization", () => {
    test("formats 10-digit IDs into Google xxx-xxx-xxxx display format", () => {
      assert.equal(GoogleAdsService.formatCustomerId("1234567890"), "123-456-7890");
      assert.equal(GoogleAdsService.formatCustomerId("9876543210"), "987-654-3210");
    });

    test("cleans formatted or raw customer IDs into standard 10 digits", () => {
      assert.equal(GoogleAdsService.cleanCustomerId("123-456-7890"), "1234567890");
      assert.equal(GoogleAdsService.cleanCustomerId(" 123-456-7890 "), "1234567890");
      assert.equal(GoogleAdsService.cleanCustomerId("1234567890"), "1234567890");
    });

    test("handles null or empty IDs gracefully", () => {
      assert.equal(GoogleAdsService.formatCustomerId(null), "");
      assert.equal(GoogleAdsService.cleanCustomerId(undefined), "");
    });
  });

  describe("4. Google Ads Error Translation & Test Account Restrictions", () => {
    test("identifies test-account-only and unapproved developer token errors", () => {
      assert.equal(
        GoogleAdsService.isTestAccountRestrictedError(403, {
          authError: "DEVELOPER_TOKEN_NOT_APPROVED",
          message: "The developer token is not approved for production.",
        }),
        true
      );

      assert.equal(
        GoogleAdsService.isTestAccountRestrictedError(403, {
          authError: "CLOUD_PROJECT_NOT_APPROVED_FOR_PRODUCTION",
          message: "The Google Cloud project is not approved for production access.",
        }),
        true
      );

      assert.equal(
        GoogleAdsService.isTestAccountRestrictedError(403, {
          authError: "USER_PERMISSION_DENIED",
          message: "User does not have access to this customer ID.",
        }),
        false
      );
    });
  });

  describe("5. Graceful Handling of Missing Developer Token", () => {
    test("getStatus reports hasDeveloperToken boolean without throwing", async () => {
      const mockUserId = "507f1f77bcf86cd799439011";
      const originalFindOne = GoogleAdsAccount.findOne;
      GoogleAdsAccount.findOne = () => Promise.resolve(null);

      try {
        const status = await GoogleAdsService.getStatus(mockUserId);
        assert.ok(status);
        assert.equal(typeof status.hasDeveloperToken, "boolean");
        assert.equal(typeof status.isConnected, "boolean");
        assert.equal(status.isConnected, false);
      } finally {
        GoogleAdsAccount.findOne = originalFindOne;
      }
    });

    test("syncAccessibleCustomers fails with clear error if developer token is missing", async () => {
      const mockUserId = "507f1f77bcf86cd799439011";
      const originalFindOne = GoogleAdsAccount.findOne;
      const originalDevToken = env.GOOGLE_ADS_DEVELOPER_TOKEN;

      GoogleAdsAccount.findOne = () => ({
        select: () =>
          Promise.resolve({
            _id: mockUserId,
            userId: mockUserId,
            encryptedRefreshToken: CryptoUtil.encrypt("dummy_token"),
            encryptedAccessToken: null,
            tokenExpiry: null,
          }),
      });

      try {
        await assert.rejects(
          async () => {
            await GoogleAdsService.syncAccessibleCustomers(mockUserId);
          },
          /Google Ads Developer Token is not configured/
        );
      } finally {
        GoogleAdsAccount.findOne = originalFindOne;
      }
    });
  });

  describe("6. Existing Google Login Integrity Verification", () => {
    test("AuthService.googleAuth requires valid payload without crashing", async () => {
      const { AuthService } = await import("../services/auth.service.js");
      assert.ok(typeof AuthService.googleAuth === "function", "AuthService.googleAuth must remain available");
      await assert.rejects(
        async () => {
          await AuthService.googleAuth({});
        },
        /Invalid Google profile response/
      );
    });
  });
});
