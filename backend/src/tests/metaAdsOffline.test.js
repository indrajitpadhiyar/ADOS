import { test, describe } from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import { CryptoUtil } from "../utils/crypto.util.js";
import { MetaAdsService } from "../services/metaAds.service.js";
import { ApiError } from "../utils/ApiError.js";
import { OAuthState } from "../models/OAuthState.model.js";
import { AdConnection } from "../models/AdConnection.model.js";
import { PlatformCredential } from "../models/PlatformCredential.model.js";
import { env } from "../config/env.js";

describe("Meta Ads & Auth Security Test Suite (Offline Unit & Integration)", () => {
  describe("1. Cryptographic Token Encryption & AES-256-GCM Security", () => {
    test("encrypts and decrypts Meta access tokens accurately", () => {
      const rawToken = "EAAGm0PX4ZCpsBA...mock_meta_access_token_12345";
      const encrypted = CryptoUtil.encrypt(rawToken);

      assert.ok(encrypted, "Encrypted string must be non-empty");
      const parts = encrypted.split(":");
      assert.equal(parts.length, 3, "Encrypted payload must contain iv:authTag:ciphertext");

      const decrypted = CryptoUtil.decrypt(encrypted);
      assert.equal(decrypted, rawToken, "Decrypted token must exactly match original raw token");
    });

    test("detects tampered ciphertext and rejects decryption via AEAD authentication tag", () => {
      const rawToken = "EAAGm0PX4ZCpsBA...sensitive_token";
      const encrypted = CryptoUtil.encrypt(rawToken);
      const parts = encrypted.split(":");

      // Tamper with ciphertext by altering last byte
      const tamperedCiphertext = parts[2].slice(0, -2) + "ff";
      const tamperedPayload = `${parts[0]}:${parts[1]}:${tamperedCiphertext}`;

      assert.throws(
        () => {
          CryptoUtil.decrypt(tamperedPayload);
        },
        /Failed to decrypt|bad decrypt|unsupported state/i,
        "Decryption must throw an error when ciphertext or auth tag is tampered"
      );
    });
  });

  describe("2. Meta OAuth State Generation & CSRF Protection", () => {
    test("generates cryptographic 32-byte hex state with 10-minute TTL", async () => {
      const mockUserId = "507f1f77bcf86cd799439011";

      let createdDoc = null;
      const originalCreate = OAuthState.create;
      OAuthState.create = async (doc) => {
        createdDoc = doc;
        return doc;
      };

      try {
        const { authUrl, state } = await MetaAdsService.generateAuthUrl(mockUserId);

        assert.ok(authUrl, "Authorization URL should be returned");
        assert.ok(authUrl.startsWith("https://www.facebook.com/"), "Must use Facebook dialog/oauth");
        assert.ok(state, "Cryptographic state must be generated");
        assert.equal(state.length, 64, "32-byte hex state must be 64 characters long");

        assert.ok(createdDoc, "OAuthState record must be created in database");
        assert.equal(createdDoc.state, state);
        assert.equal(createdDoc.platform, "meta");
        assert.equal(createdDoc.used, false);
        assert.ok(createdDoc.expiresAt.getTime() > Date.now() + 8 * 60 * 1000, "Expires in ~10 minutes");
      } finally {
        OAuthState.create = originalCreate;
      }
    });

    test("blocks replay attacks by rejecting already-used OAuth state", async () => {
      const originalFindOne = OAuthState.findOne;
      OAuthState.findOne = async () => ({
        state: "mock_used_state_12345",
        used: true,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
        save: async () => {},
      });

      try {
        await assert.rejects(
          async () => {
            await MetaAdsService.handleOAuthCallback("mock_code", "mock_used_state_12345");
          },
          (err) => {
            assert.equal(err.statusCode, 400);
            assert.match(err.message, /already been used/i);
            return true;
          }
        );
      } finally {
        OAuthState.findOne = originalFindOne;
      }
    });

    test("rejects non-existent or expired OAuth state", async () => {
      const originalFindOne = OAuthState.findOne;
      OAuthState.findOne = async () => null;

      try {
        await assert.rejects(
          async () => {
            await MetaAdsService.handleOAuthCallback("mock_code", "non_existent_state");
          },
          (err) => {
            assert.equal(err.statusCode, 400);
            assert.match(err.message, /Invalid or unrecognized OAuth state/i);
            return true;
          }
        );
      } finally {
        OAuthState.findOne = originalFindOne;
      }
    });
  });

  describe("3. Multi-Tenant Account Selection Authorization (IDOR Prevention)", () => {
    test("rejects attempt by User A to select ad accounts belonging to User B with 403 Forbidden", async () => {
      const userAId = "507f1f77bcf86cd799439011";
      const userBAccountId = "act_9999999999";

      const originalFind = AdConnection.find;
      AdConnection.find = async (query) => {
        if (query.userId === userAId) {
          return [
            {
              userId: userAId,
              platform: "meta",
              externalAccountId: "act_1001",
              accountName: "User A Store",
              selected: false,
              save: async () => {},
            },
          ];
        }
        return [];
      };

      try {
        await assert.rejects(
          async () => {
            await MetaAdsService.selectAccounts(userAId, [userBAccountId]);
          },
          (err) => {
            assert.equal(err.statusCode, 403, "Must return HTTP 403 Forbidden");
            assert.match(err.message, /Unauthorized or invalid Meta ad account ID/i);
            return true;
          }
        );
      } finally {
        AdConnection.find = originalFind;
      }
    });
  });

  describe("4. Meta Data Deletion Signed Request Verification (HMAC-SHA256)", () => {
    test("validates authentic signed_request and extracts platform user ID", () => {
      const secret = env.META_APP_SECRET || "";

      const payload = {
        user_id: "meta_user_99887766",
        algorithm: "HMAC-SHA256",
        issued_at: Math.floor(Date.now() / 1000),
      };

      const payloadBase64 = Buffer.from(JSON.stringify(payload))
        .toString("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=/g, "");

      const signature = crypto
        .createHmac("sha256", secret)
        .update(payloadBase64)
        .digest("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=/g, "");

      const signedRequest = `${signature}.${payloadBase64}`;
      const parsed = MetaAdsService.parseSignedRequest(signedRequest);

      assert.equal(parsed.user_id, "meta_user_99887766");
    });

    test("rejects forged or tampered signed_request with 401 Unauthorized", () => {
      const payload = {
        user_id: "meta_user_attacker",
        algorithm: "HMAC-SHA256",
      };
      const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString("base64url");
      const fakeSignedRequest = `invalid_signature_hex.${payloadBase64}`;

      assert.throws(
        () => {
          MetaAdsService.parseSignedRequest(fakeSignedRequest);
        },
        (err) => {
          assert.equal(err.statusCode, 401);
          assert.match(err.message, /HMAC does not match/i);
          return true;
        }
      );
    });
  });

  describe("5. Ephemeral Token Exchange Security", () => {
    test("rejects invalid or expired exchange ticket codes with 401 Unauthorized", async () => {
      const originalFindOne = OAuthState.findOne;
      OAuthState.findOne = async () => null;

      try {
        const { AuthController } = await import("../controllers/auth.controller.js");
        const req = { body: { code: "invalid_exchange_code" } };
        const res = {};

        const caughtError = await new Promise((resolve) => {
          AuthController.exchangeToken(req, res, (err) => resolve(err));
        });

        assert.ok(caughtError, "Should pass error to next()");
        assert.equal(caughtError.statusCode, 401);
        assert.match(caughtError.message, /Invalid, expired, or already used/i);
      } finally {
        OAuthState.findOne = originalFindOne;
      }
    });

    test("successfully exchanges valid ticket code for tokens and marks ticket consumed", async () => {
      let isSaved = false;

      const mockTicket = {
        state: "test_valid_code_123",
        platform: "google_login_exchange",
        metadata: {
          accessToken: "mock_jwt_access_token",
          refreshToken: "mock_jwt_refresh_token",
          user: { _id: "507f1f77bcf86cd799439011", email: "user@example.com" },
        },
        used: false,
        expiresAt: new Date(Date.now() + 60000),
        save: async function () {
          isSaved = true;
          this.used = true;
        },
      };

      const originalFindOne = OAuthState.findOne;
      OAuthState.findOne = async () => mockTicket;

      try {
        const { AuthController } = await import("../controllers/auth.controller.js");
        const req = { body: { code: "test_valid_code_123" } };
        let responsePayload = null;
        let setCookies = [];

        await new Promise((resolve, reject) => {
          const res = {
            cookie: (name, val, opts) => {
              setCookies.push({ name, val, opts });
            },
            status: () => ({
              json: (payload) => {
                responsePayload = payload;
                resolve();
              },
            }),
          };
          AuthController.exchangeToken(req, res, (err) => (err ? reject(err) : resolve()));
        });

        assert.ok(responsePayload, "Should return response payload");
        assert.equal(responsePayload.success, true);
        assert.equal(responsePayload.data.accessToken, "mock_jwt_access_token");
        assert.equal(mockTicket.used, true, "Ticket must be marked as used");
        assert.equal(isSaved, true, "Ticket save() must be called");
      } finally {
        OAuthState.findOne = originalFindOne;
      }
    });
  });

  describe("6. Meta Graph API Resilience: Empty Campaigns & Token Revocation (Code 190)", () => {
    const mockUserId = "507f1f77bcf86cd799439011";
    const encryptedToken = CryptoUtil.encrypt("EAA_MOCK_VALID_ACCESS_TOKEN");

    test("cleanly returns 200 payload with 0 metrics when ad account has 0 campaigns", async () => {
      const originalCredFindOne = PlatformCredential.findOne;
      const originalConnFind = AdConnection.find;
      const originalConnFindOne = AdConnection.findOne;
      const originalFetch = global.fetch;

      PlatformCredential.findOne = () => ({
        select: async () => ({
          userId: mockUserId,
          platform: "meta",
          encryptedAccessToken: encryptedToken,
          status: "Connected",
          save: async () => {},
        }),
      });

      const mockConn = {
        userId: mockUserId,
        platform: "meta",
        externalAccountId: "act_1001",
        accountName: "Zero Campaign Account",
        currency: "USD",
        timezone: "America/New_York",
        selected: true,
      };

      AdConnection.find = () => ({
        lean: async () => [mockConn],
      });
      AdConnection.findOne = () => ({
        lean: async () => mockConn,
      });

      // Mock Meta API response returning empty data array
      global.fetch = async () => ({
        ok: true,
        json: async () => ({
          data: [],
          paging: {},
        }),
      });

      try {
        const analytics = await MetaAdsService.getAnalytics(mockUserId);

        assert.ok(analytics, "Analytics response must be defined");
        assert.equal(analytics.campaigns.length, 0, "Campaigns list must be empty array []");
        assert.equal(analytics.summary.totalSpend, 0, "Total spend must be 0");
        assert.equal(analytics.summary.totalImpressions, 0, "Total impressions must be 0");
        assert.equal(analytics.summary.totalClicks, 0, "Total clicks must be 0");
        assert.equal(analytics.summary.totalConversions, 0, "Total conversions must be 0");
      } finally {
        PlatformCredential.findOne = originalCredFindOne;
        AdConnection.find = originalConnFind;
        AdConnection.findOne = originalConnFindOne;
        global.fetch = originalFetch;
      }
    });

    test("detects Meta error code 190, marks credential Expired, and throws 401 Unauthorized", async () => {
      const originalCredFindOne = PlatformCredential.findOne;
      const originalConnFind = AdConnection.find;
      const originalConnFindOne = AdConnection.findOne;
      const originalFetch = global.fetch;

      let savedCredentialStatus = null;
      const mockCredential = {
        userId: mockUserId,
        platform: "meta",
        encryptedAccessToken: encryptedToken,
        status: "Connected",
        save: async function () {
          savedCredentialStatus = this.status;
        },
      };

      PlatformCredential.findOne = () => ({
        select: async () => mockCredential,
      });

      const mockConn = {
        userId: mockUserId,
        platform: "meta",
        externalAccountId: "act_1001",
        accountName: "Revoked Account",
        currency: "USD",
        selected: true,
      };

      AdConnection.find = () => ({
        lean: async () => [mockConn],
      });
      AdConnection.findOne = () => ({
        lean: async () => mockConn,
      });

      // Mock Meta API response returning Error 190 (Invalid/Expired OAuth access token)
      global.fetch = async () => ({
        ok: false,
        json: async () => ({
          error: {
            message: "Error validating access token: The session is invalid because the user logged out.",
            type: "OAuthException",
            code: 190,
            error_subcode: 460,
          },
        }),
      });

      try {
        await assert.rejects(
          async () => {
            await MetaAdsService.getAnalytics(mockUserId);
          },
          (err) => {
            assert.equal(err.statusCode, 401, "Must throw HTTP 401 Unauthorized");
            assert.match(err.message, /Meta access token has expired or was revoked/i);
            return true;
          }
        );

        assert.equal(savedCredentialStatus, "Expired", "Credential status in DB must transition to 'Expired'");
      } finally {
        PlatformCredential.findOne = originalCredFindOne;
        AdConnection.find = originalConnFind;
        AdConnection.findOne = originalConnFindOne;
        global.fetch = originalFetch;
      }
    });
  });
});
