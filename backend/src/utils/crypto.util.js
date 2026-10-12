import crypto from "node:crypto";
import { env } from "../config/env.js";

/**
 * Derives a 32-byte encryption key from the application secret
 */
const getEncryptionKey = () => {
  const secret = env.COOKIE_SECRET || env.JWT_ACCESS_SECRET || "ados_default_secure_vault_key_2026";
  return crypto.createHash("sha256").update(secret).digest();
};

/**
 * AES-256-GCM Encryption / Decryption Utility
 * Encrypts sensitive tokens at rest with authenticated tags
 */
export const CryptoUtil = {
  /**
   * Encrypt a plaintext string using AES-256-GCM
   * @param {string} plaintext
   * @returns {string} iv:authTag:ciphertext (hex encoded)
   */
  encrypt(plaintext) {
    if (!plaintext) return null;
    try {
      const key = getEncryptionKey();
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
   * @param {string} encryptedPayload iv:authTag:ciphertext
   * @returns {string} decrypted plaintext
   */
  decrypt(encryptedPayload) {
    if (!encryptedPayload) return null;
    try {
      const parts = encryptedPayload.split(":");
      if (parts.length !== 3) {
        throw new Error("Invalid encrypted payload format.");
      }

      const [ivHex, authTagHex, encryptedHex] = parts;
      const key = getEncryptionKey();
      const iv = Buffer.from(ivHex, "hex");
      const authTag = Buffer.from(authTagHex, "hex");

      const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
      decipher.setAuthTag(authTag);

      let decrypted = decipher.update(encryptedHex, "hex", "utf8");
      decrypted += decipher.final("utf8");

      return decrypted;
    } catch (error) {
      console.error("CryptoUtil decryption error:", error.message);
      throw new Error("Failed to decrypt secure credential. Token may be corrupted or invalid.");
    }
  },
};
