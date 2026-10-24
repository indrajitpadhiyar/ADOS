import mongoose from "mongoose";

const accessibleMetaAccountSchema = new mongoose.Schema(
  {
    id: {
      type: String, // e.g. "act_101582910"
      required: true,
    },
    accountId: {
      type: String, // e.g. "101582910"
      required: true,
    },
    name: {
      type: String,
      default: "Meta Ad Account",
    },
    currency: {
      type: String,
      default: "USD",
    },
    accountStatus: {
      type: Number,
      default: 1, // 1 = ACTIVE in Meta Marketing API
    },
    timezoneName: {
      type: String,
      default: "UTC",
    },
  },
  { _id: false }
);

const metaAdsAccountSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    encryptedAccessToken: {
      type: String,
      required: true,
      select: false, // Hidden from queries by default for defense in depth
    },
    tokenExpiry: {
      type: Date,
      default: null,
    },
    scope: {
      type: String,
      default: "ads_read,read_insights",
    },
    metaUserId: {
      type: String,
      default: null,
    },
    connectedEmail: {
      type: String,
      default: null,
    },
    connectedName: {
      type: String,
      default: null,
    },
    selectedAccountId: {
      type: String, // e.g. "act_101582910"
      default: null,
      trim: true,
    },
    selectedAccountName: {
      type: String,
      default: null,
      trim: true,
    },
    selectedAccountCurrency: {
      type: String,
      default: "USD",
    },
    selectedAccountTimeZone: {
      type: String,
      default: "UTC",
    },
    accessibleAccounts: {
      type: [accessibleMetaAccountSchema],
      default: [],
    },
    status: {
      type: String,
      enum: ["Connected", "Disconnected", "Error", "Expired", "Requires_Reauth"],
      default: "Connected",
    },
    lastSyncAt: {
      type: Date,
      default: null,
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

export const MetaAdsAccount = mongoose.model("MetaAdsAccount", metaAdsAccountSchema);
