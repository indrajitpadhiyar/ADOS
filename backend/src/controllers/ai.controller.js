import { AiGenerationService } from "../services/ai/aiGeneration.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const AiController = {
  /**
   * POST /api/v1/ai/generate-image
   * Generates genuine AI image with strict quota checks
   */
  generateImage: asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { prompt, style, size, width, height, seed } = req.body;

    const result = await AiGenerationService.generateImage(userId, {
      prompt,
      style,
      size,
      width,
      height,
      seed,
    });

    return ApiResponse.created(res, "AI image generated successfully", result);
  }),

  /**
   * GET /api/v1/ai/quota
   * Retrieves user's current daily generation quota
   */
  getQuota: asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const quota = await AiGenerationService.getQuota(userId);

    return ApiResponse.success(res, "Daily AI quota retrieved", quota);
  }),

  /**
   * GET /api/v1/ai/history
   * Retrieves previous legitimate user generations
   */
  getHistory: asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { limit } = req.query;
    const history = await AiGenerationService.getHistory(userId, { limit });

    return ApiResponse.success(res, "Generation history retrieved", history);
  }),

  /**
   * GET /api/v1/ai/video-status
   * Reports genuine video provider status
   */
  getVideoStatus: asyncHandler(async (req, res) => {
    const status = AiGenerationService.getVideoStatus();
    return ApiResponse.success(res, "Video provider capability status", status);
  }),

  /**
   * POST /api/v1/ai/generate-video
   * Transparently reports video configuration requirement (no fake assets)
   */
  generateVideo: asyncHandler(async (req, res) => {
    const status = AiGenerationService.getVideoStatus();
    return ApiResponse.badRequest(res, status.message, status);
  }),
};
