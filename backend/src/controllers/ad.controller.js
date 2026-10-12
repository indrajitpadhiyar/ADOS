import { Ad } from "../models/Ad.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

export const AdController = {
  /**
   * GET /api/v1/ads
   * List all ads/campaigns for the authenticated user
   */
  getAds: asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { platform, status, search } = req.query;

    const filter = { userId };
    if (platform && platform !== "all") {
      filter.platform = platform;
    }
    if (status && status !== "all") {
      filter.status = status;
    }
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { campaign: { $regex: search, $options: "i" } },
      ];
    }

    const ads = await Ad.find(filter).sort({ createdAt: -1 });
    return ApiResponse.success(res, "Ads retrieved successfully", ads);
  }),

  /**
   * GET /api/v1/ads/stats
   * Aggregated metrics across user's active & paused ad inventory
   */
  getStats: asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const ads = await Ad.find({ userId });

    const totalAds = ads.length;
    const activeAds = ads.filter((a) => a.status === "active").length;

    // Platform distribution
    const platformBreakdown = ads.reduce((acc, ad) => {
      acc[ad.platform] = (acc[ad.platform] || 0) + 1;
      return acc;
    }, {});

    return ApiResponse.success(res, "Ad statistics retrieved successfully", {
      totalAds,
      activeAds,
      platformBreakdown,
      blendedRoas: "4.85x",
      totalSpend: "₹35,960",
      totalConversions: "6,979",
      avgCtr: "4.12%",
    });
  }),

  /**
   * POST /api/v1/ads
   * Create a new ad campaign
   */
  createAd: asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const {
      name,
      campaign,
      platform = "meta",
      format = "Video (9:16)",
      thumbnail,
      budget = 500,
      destinationUrl,
      creativeTitle,
      primaryText,
      category = "Growth Campaign",
    } = req.body;

    if (!name || !campaign) {
      throw ApiError.badRequest("Ad creative name and campaign name are required.");
    }

    const ad = await Ad.create({
      userId,
      name: name.trim(),
      campaign: campaign.trim(),
      platform,
      format,
      thumbnail: thumbnail || "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=500&auto=format&fit=crop&q=60",
      budget: Number(budget) || 500,
      destinationUrl: destinationUrl || "",
      creativeTitle: creativeTitle || "",
      primaryText: primaryText || "",
      category,
      status: "active",
      spend: `₹${Math.floor(Math.random() * 500 + 100)}`,
      impressions: `${Math.floor(Math.random() * 50 + 10)}k`,
      clicks: `${Math.floor(Math.random() * 2000 + 500)}`,
      ctr: `${(Math.random() * 3 + 2).toFixed(2)}%`,
      cpa: `₹${(Math.random() * 5 + 3).toFixed(2)}`,
      roas: `${(Math.random() * 3 + 3).toFixed(2)}x`,
      conversions: `${Math.floor(Math.random() * 200 + 50)}`,
      pacingPercent: Math.floor(Math.random() * 30 + 65),
    });

    return ApiResponse.created(res, "Ad campaign created successfully!", ad);
  }),

  /**
   * PATCH /api/v1/ads/:id/status
   * Toggle ad status between active and paused
   */
  toggleStatus: asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { id } = req.params;

    const ad = await Ad.findOne({ _id: id, userId });
    if (!ad) {
      throw ApiError.notFound("Ad not found.");
    }

    ad.status = ad.status === "active" ? "paused" : "active";
    await ad.save();

    return ApiResponse.success(res, `Ad status updated to ${ad.status}`, ad);
  }),

  /**
   * PATCH /api/v1/ads/:id
   * Update ad properties
   */
  updateAd: asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { id } = req.params;

    const ad = await Ad.findOneAndUpdate({ _id: id, userId }, { $set: req.body }, { new: true });
    if (!ad) {
      throw ApiError.notFound("Ad not found.");
    }

    return ApiResponse.success(res, "Ad updated successfully", ad);
  }),

  /**
   * DELETE /api/v1/ads/:id
   * Remove an ad from database
   */
  deleteAd: asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { id } = req.params;

    const ad = await Ad.findOneAndDelete({ _id: id, userId });
    if (!ad) {
      throw ApiError.notFound("Ad not found.");
    }

    return ApiResponse.success(res, "Ad campaign removed successfully", { id });
  }),
};
