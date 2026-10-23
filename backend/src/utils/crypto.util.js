import crypto from "node:crypto";
import { env } from "../config/env.js";

/**
 * Derives primary 32-byte key:
 * If env.ENCRYPTION_KEY is defined, derives key from it.
 * Otherwise, falls back to env.COOKIE_SECRET || env.JWT_ACCESS_SECRET.
 */
const getPrimaryKey = () => {
  const secret = env.ENCRYPTION_KEY || env.COOKIE_SECRET || env.JWT_ACCESS_SECRET || "ados_default_secure_vault_key_2026";
  return crypto.createHash("sha256").update(secret).digest();
};

/**
 * Derives legacy 32-byte key:
 * Preserves the previous key derived from COOKIE_SECRET/JWT_ACCESS_SECRET.
 * Guarantees zero decryption failures for existing stored tokens.
 */
const getLegacyKey = () => {
  const secret = env.COOKIE_SECRET || env.JWT_ACCESS_SECRET || "ados_default_secure_vault_key_2026";
  return crypto.createHash("sha256").update(secret).digest();
};

const decryptWithKey = (encryptedPayload, key) => {
  const parts = encryptedPayload.split(":");
  if (parts.length !== 3) {
    throw new Error("Invalid encrypted payload format.");
  }

  const [ivHex, authTagHex, encryptedHex] = parts;
  const iv = Buffer.from(ivHex, "hex");
  const authTag = Buffer.from(authTagHex, "hex");

  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encryptedHex, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
};

/**
 * AES-256-GCM Encryption / Decryption Utility
 * Encrypts sensitive tokens at rest with authenticated tags
 */
export const CryptoUtil = {
  /**
   * Encrypt a plaintext string using AES-256-GCM with the primary key
   * @param {string} plaintext
   * @returns {string} iv:authTag:ciphertext (hex encoded)
   */
  encrypt(plaintext) {
    if (!plaintext) return null;
    try {
      const key = getPrimaryKey();
      const iv = crypto.randomBytes(12); // 96-bit IV recommended for GCM
      const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);

      let encrypted = cipher.update(plaintext, "utf8", "hex");
      encrypted += cipher.final("hex");

      const authTag = cipher.getAuthTag();

      return `${iv.toString("hex")}:${authTag.toString("hex")}:${encrypted}`;
    } catch (error) {
      console.error("CryptoUtil encryption error:", error.message);
      throw new Error("Failed to securely encrypt sensitive credential.");
    }
  },

  /**
   * Decrypt a ciphertext string using AES-256-GCM
   * Attempts primary key first; if that fails and a separate legacy key exists, falls back gracefully.
   * @param {string} encryptedPayload iv:authTag:ciphertext
   * @returns {string} decrypted plaintext
   */
  decrypt(encryptedPayload) {
    if (!encryptedPayload) return null;
    const primaryKey = getPrimaryKey();

    try {
      return decryptWithKey(encryptedPayload, primaryKey);
    } catch (primaryErr) {
      const legacyKey = getLegacyKey();
      // If primary key is different from legacy key, attempt legacy fallback
      if (!primaryKey.equals(legacyKey)) {
        try {
          return decryptWithKey(encryptedPayload, legacyKey);
        } catch (legacyErr) {
          // Fall through to error
        }
      }

      console.error("CryptoUtil decryption error:", primaryErr.message);
      throw new Error("Failed to decrypt secure credential. Token may be corrupted or invalid.");
    }
  },
};
