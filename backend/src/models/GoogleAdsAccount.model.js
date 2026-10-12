import mongoose from "mongoose";

const accessibleCustomerSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
    },
    descriptiveName: {
      type: String,
      default: "Google Ads Account",
    },
    currencyCode: {
      type: String,
      default: "USD",
    },
    timeZone: {
      type: String,
      default: "UTC",
    },
    manager: {
      type: Boolean,
      default: false,
    },
    testAccount: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

const googleAdsAccountSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    encryptedRefreshToken: {
      type: String,
      required: true,
      select: false, // Hidden from queries by default for defense in depth
    },
    encryptedAccessToken: {
      type: String,
      default: null,
      select: false, // Hidden from queries by default
    },
    tokenExpiry: {
      type: Date,
      default: null,
    },
    scope: {
      type: String,
      default: "https://www.googleapis.com/auth/adwords",
    },
    connectedEmail: {
      type: String,
      default: null,
    },
    selectedCustomerId: {
      type: String,
      default: null,
      trim: true,
    },
    selectedCustomerName: {
      type: String,
      default: null,
      trim: true,
    },
    selectedCustomerCurrency: {
      type: String,
      default: "USD",
    },
    selectedCustomerTimeZone: {
      type: String,
      default: "UTC",
    },
    isManagerAccount: {
      type: Boolean,
      default: false,
    },
    isTestAccount: {
      type: Boolean,
      default: false,
    },
    loginCustomerId: {
      type: String,
      default: null,
      trim: true,
    },
    accessibleCustomers: {
      type: [accessibleCustomerSchema],
      default: [],
    },
    status: {
      type: String,
      enum: ["CONNECTED", "TOKEN_EXPIRED", "REVOKED", "ERROR"],
      default: "CONNECTED",
      index: true,
    },
    lastSyncAt: {
      type: Date,
      default: null,
    },
    errorMessage: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      transform(doc, ret) {
        // Strict guard: ensure sensitive fields are never exposed in JSON serialization
        delete ret.encryptedRefreshToken;
        delete ret.encryptedAccessToken;
        delete ret.__v;
        return ret;
      },
    },
  }
);

export const GoogleAdsAccount = mongoose.model("GoogleAdsAccount", googleAdsAccountSchema);
