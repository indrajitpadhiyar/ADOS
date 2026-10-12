import { ConnectedAccount } from "../models/ConnectedAccount.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

export const AccountController = {
  /**
   * GET /api/v1/accounts
   * List connected advertising accounts
   */
  getAccounts: asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const accounts = await ConnectedAccount.find({ userId }).sort({ createdAt: -1 });
    return ApiResponse.success(res, "Connected accounts retrieved successfully", accounts);
  }),

  /**
   * POST /api/v1/accounts
   * Connect a new platform account
   */
  connectAccount: asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { name, accountId, platform, spendCap = "₹20,000/mo", currency = "INR (₹)", iconBg } = req.body;

    if (!name || !accountId || !platform) {
      throw ApiError.badRequest("Account name, external account ID, and platform are required.");
    }

    const defaultColors = {
      meta: "bg-blue-600",
      google: "bg-emerald-600",
      linkedin: "bg-blue-700",
      tiktok: "bg-neutral-900",
      amazon: "bg-amber-600",
      youtube: "bg-red-600",
      snapchat: "bg-yellow-500",
      pinterest: "bg-rose-600",
    };

    const newAccount = await ConnectedAccount.create({
      userId,
      name: name.trim(),
      accountId: accountId.trim(),
      platform,
      spendCap,
      currency,
      iconBg: iconBg || defaultColors[platform] || "bg-emerald-600",
      status: "Healthy",
      lastSync: "Just now",
      activeCampaigns: Math.floor(Math.random() * 6 + 1),
    });

    return ApiResponse.created(res, "Account connected successfully!", newAccount);
  }),

  /**
   * PATCH /api/v1/accounts/:id
   * Update account settings
   */
  updateAccount: asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { id } = req.params;

    const account = await ConnectedAccount.findOneAndUpdate(
      { _id: id, userId },
      { $set: req.body },
      { new: true }
    );

    if (!account) {
      throw ApiError.notFound("Account not found.");
    }

    return ApiResponse.success(res, "Account updated successfully", account);
  }),

  /**
   * DELETE /api/v1/accounts/:id
   * Disconnect platform account
   */
  disconnectAccount: asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { id } = req.params;

    const account = await ConnectedAccount.findOneAndDelete({ _id: id, userId });
    if (!account) {
      throw ApiError.notFound("Account not found.");
    }

    return ApiResponse.success(res, "Account disconnected successfully", { id });
  }),
};
