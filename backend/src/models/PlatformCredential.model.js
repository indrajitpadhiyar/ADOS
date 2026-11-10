import mongoose from "mongoose";

const platformCredentialSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    platform: {
      type: String,
      required: true,
      enum: ["meta", "google", "linkedin", "tiktok"],
      default: "meta",
      index: true,
    },
    encryptedAccessToken: {
      type: String,
      required: true,
      select: false,
    },
    encryptedRefreshToken: {
      type: String,
      default: null,
      select: false,
    },
    tokenExpiry: {
      type: Date,
      default: null,
    },
    scope: {
      type: String,
      default: "ads_read",
    },
    metaUserId: {
      type: String,
      default: null,
    },
    metaUserName: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ["Connected", "Disconnected", "Expired"],
      default: "Connected",
    },
    lastSyncedAt: {
      type: Date,
      default: Date.now,
    },
    lastError: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

platformCredentialSchema.index({ userId: 1, platform: 1 }, { unique: true });

export const PlatformCredential = mongoose.model(
  "PlatformCredential",
  platformCredentialSchema
);

