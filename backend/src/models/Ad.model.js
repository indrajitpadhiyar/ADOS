import mongoose from "mongoose";

const adSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, "Ad creative name is required"],
      trim: true,
    },
    campaign: {
      type: String,
      required: [true, "Campaign name is required"],
      trim: true,
    },
    platform: {
      type: String,
      enum: ["meta", "facebook", "google", "linkedin", "youtube", "amazon", "tiktok", "snapchat", "pinterest", "other"],
      default: "meta",
      index: true,
    },
    format: {
      type: String,
      default: "Video (9:16)",
    },
    thumbnail: {
      type: String,
      default: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=500&auto=format&fit=crop&q=60",
    },
    status: {
      type: String,
      enum: ["active", "paused", "archived"],
      default: "active",
      index: true,
    },
    spend: {
      type: String,
      default: "₹0",
    },
    impressions: {
      type: String,
      default: "0",
    },
    clicks: {
      type: String,
      default: "0",
    },
    ctr: {
      type: String,
      default: "0.00%",
    },
    cpa: {
      type: String,
      default: "₹0.00",
    },
    roas: {
      type: String,
      default: "0.00x",
    },
    conversions: {
      type: String,
      default: "0",
    },
    budget: {
      type: Number,
      default: 500,
    },
    pacingPercent: {
      type: Number,
      default: 75,
    },
    pacingColor: {
      type: String,
      default: "bg-[#0f766e]",
    },
    category: {
      type: String,
      default: "Multi-Platform Growth",
    },
    destinationUrl: {
      type: String,
      default: "",
    },
    creativeTitle: {
      type: String,
      default: "",
    },
    primaryText: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Ad = mongoose.model("Ad", adSchema);
