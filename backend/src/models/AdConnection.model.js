import mongoose from "mongoose";

const adConnectionSchema = new mongoose.Schema(
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
    externalAccountId: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    accountName: {
      type: String,
      required: true,
      trim: true,
      default: "Ad Account",
    },
    currency: {
      type: String,
      default: "USD",
      uppercase: true,
      trim: true,
    },
    timezone: {
      type: String,
      default: "UTC",
      trim: true,
    },
    selected: {
      type: Boolean,
      default: false,
      index: true,
    },
    status: {
      type: String,
      default: "ACTIVE",
      trim: true,
    },
    lastSyncedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Prevent duplicate connections for the same account per user & platform
adConnectionSchema.index(
  { userId: 1, platform: 1, externalAccountId: 1 },
  { unique: true }
);

export const AdConnection = mongoose.model("AdConnection", adConnectionSchema);

