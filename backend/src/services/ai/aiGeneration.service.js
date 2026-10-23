import { env } from "../../config/env.js";
import { AiGeneration } from "../../models/AiGeneration.model.js";
import { HuggingFaceImageProvider } from "./providers/huggingFace.provider.js";
import { PollinationsImageProvider } from "./providers/pollinations.provider.js";
import { VideoProvider } from "./providers/video.provider.js";
import { ApiError } from "../../utils/ApiError.js";
import { SecurityLogger } from "../../utils/securityLogger.util.js";

const STYLE_PROMPTS = {
  photorealistic: "masterpiece, commercial advertisement photography, professional studio lighting, 8k uhd, photorealistic, sharp focus",
  cinematic: "cinematic 35mm film still, dramatic volumetric lighting, anamorphic, color graded, shallow depth of field",
  minimal: "clean minimal graphic design, elegant aesthetic, soft studio shadows, premium product photography",
  neon: "cyberpunk, vibrant neon lighting, high contrast, glossy reflections, glowing accents",
  vintage: "retro film grain, 1970s aesthetic, nostalgic color palette, analog photography warmth",
};

export class AiGenerationService {
  /**
   * Calculates the start of the current day (UTC) for quota tracking
   */
  static getStartOfDay() {
    const now = new Date();
    return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0, 0));
  }

  /**
   * Retrieves remaining daily generation quota for the user
   * @param {string} userId
   * @returns {Promise<{ usedToday: number, dailyLimit: number, remainingToday: number, resetsAt: Date }>}
   */
  static async getQuota(userId) {
    const startOfDay = this.getStartOfDay();
    const usedToday = await AiGeneration.countDocuments({
      userId,
      type: "image",
      status: "completed",
      createdAt: { $gte: startOfDay },
    });

    const dailyLimit = env.AI_FREE_DAILY_LIMIT || 10;
    const remainingToday = Math.max(0, dailyLimit - usedToday);

    const resetsAt = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);

    return {
      usedToday,
      dailyLimit,
      remainingToday,
      resetsAt,
      provider: env.AI_IMAGE_PROVIDER || (env.HF_TOKEN ? "huggingface" : "pollinations"),
    };
  }

  /**
   * Builds an enhanced visual prompt incorporating creative style directives
   */
  static enhancePrompt(rawPrompt, style = "photorealistic") {
    const base = rawPrompt.trim();
    const styleModifier = STYLE_PROMPTS[style.toLowerCase()] || STYLE_PROMPTS.photorealistic;
    return `${base}, ${styleModifier}, high quality, detailed`;
  }

  /**
   * Dispatches image generation to configured free provider with strict quota enforcement
   * @param {string} userId - Authenticated user ID
   * @param {Object} options - { prompt, style, size, width, height, seed }
   */
  static async generateImage(userId, { prompt, style = "photorealistic", size = "square", width = 1024, height = 1024, seed = null }) {
    if (!prompt || !prompt.trim()) {
      throw ApiError.badRequest("Image prompt is required.");
    }

    // 1. Quota Enforcement
    const quota = await this.getQuota(userId);
    if (quota.remainingToday <= 0) {
      SecurityLogger.log("AI_FREE_QUOTA_EXHAUSTED", {
        userId,
        outcome: "BLOCKED",
        details: `Daily limit of ${quota.dailyLimit} reached`,
      });
      throw ApiError.tooManyRequests(
        `Free generation limit reached. You have reached your daily limit of ${quota.dailyLimit} free generations. Quota resets at ${quota.resetsAt.toUTCString()}.`
      );
    }

    // 2. Select Provider
    const preferredProvider = env.AI_IMAGE_PROVIDER || (env.HF_TOKEN ? "huggingface" : "pollinations");
    const enhancedPrompt = this.enhancePrompt(prompt, style);

    let result;
    let usedProvider = preferredProvider;
    let errorMessage = null;

    try {
      if (preferredProvider === "huggingface" && env.HF_TOKEN) {
        result = await HuggingFaceImageProvider.generate({
          prompt: enhancedPrompt,
          width,
          height,
          seed,
        });
      } else {
        result = await PollinationsImageProvider.generate({
          prompt: enhancedPrompt,
          width,
          height,
          seed,
        });
        usedProvider = "pollinations";
      }
    } catch (providerErr) {
      // If Hugging Face free credits are exhausted, stop immediately. Never enable paid fallback!
      if (providerErr.message?.includes("Free generation limit reached")) {
        throw providerErr;
      }

      // If network error occurred with primary provider, fall back to free community engine
      if (preferredProvider === "huggingface") {
        console.warn("Notice: Falling back to free community inference engine:", providerErr.message);
        result = await PollinationsImageProvider.generate({
          prompt: enhancedPrompt,
          width,
          height,
          seed,
        });
        usedProvider = "pollinations";
      } else {
        errorMessage = providerErr.message;
        throw providerErr;
      }
    }

    // 3. Persist Generation Job Record in MongoDB
    const record = await AiGeneration.create({
      userId,
      type: "image",
      prompt: prompt.trim(),
      enhancedPrompt,
      provider: usedProvider,
      model: result.model || "flux-schnell",
      status: "completed",
      outputUrl: result.imageUrl,
      metadata: {
        width,
        height,
        size,
        style,
        seed: result.seed,
      },
      errorMessage,
    });

    SecurityLogger.log("AI_IMAGE_GENERATION_SUCCESS", {
      userId,
      provider: usedProvider,
      outcome: "SUCCESS",
    });

    return {
      id: record._id,
      imageUrl: result.imageUrl,
      provider: usedProvider,
      model: result.model,
      prompt: prompt.trim(),
      style,
      size,
      seed: result.seed,
      remainingToday: quota.remainingToday - 1,
      createdAt: record.createdAt,
    };
  }

  /**
   * Retrieves previous legitimate user generations
   */
  static async getHistory(userId, { limit = 20 } = {}) {
    return await AiGeneration.find({ userId, status: "completed" })
      .sort({ createdAt: -1 })
      .limit(Math.min(Number(limit) || 20, 50))
      .select("prompt enhancedPrompt provider outputUrl metadata createdAt");
  }

  /**
   * Reports video provider status (transparently unconfigured without fake demo videos)
   */
  static getVideoStatus() {
    return VideoProvider.getStatus();
  }
}
