import { AnalyticsService } from "../services/analytics.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const AnalyticsController = {
  /**
   * GET /api/v1/analytics/overview
   */
  getOverview: asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { dateRange = "LAST_30_DAYS" } = req.query;
    const data = await AnalyticsService.getOverview(userId, dateRange);
    return ApiResponse.success(res, "Analytics overview retrieved successfully", data);
  }),

  /**
   * GET /api/v1/analytics/campaigns
   */
  getCampaigns: asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { dateRange = "LAST_30_DAYS", platform = "all", search = "", page = 1, limit = 50 } = req.query;
    const data = await AnalyticsService.getCampaigns(userId, { dateRange, platform, search, page, limit });
    return ApiResponse.success(res, "Campaigns analytics retrieved successfully", data);
  }),
};
