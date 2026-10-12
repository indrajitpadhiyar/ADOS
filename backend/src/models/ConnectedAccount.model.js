import mongoose from "mongoose";

const connectedAccountSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, "Account name is required"],
      trim: true,
    },
    accountId: {
      type: String,
      required: [true, "External Account ID is required"],
      trim: true,
    },
    platform: {
      type: String,
      enum: ["meta", "facebook", "google", "linkedin", "tiktok", "amazon", "youtube", "snapchat", "pinterest", "other"],
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["Healthy", "Warning", "Paused", "Error"],
      default: "Healthy",
    },
    lastSync: {
      type: String,
      default: "Just now",
    },
    activeCampaigns: {
      type: Number,
      default: 0,
    },
    currency: {
      type: String,
      default: "INR (₹)",
    },
    spendCap: {
      type: String,
      default: "₹25,000/mo",
    },
    iconBg: {
      type: String,
      default: "bg-emerald-600",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const ConnectedAccount = mongoose.model("ConnectedAccount", connectedAccountSchema);
