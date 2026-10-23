import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { AiGenerationService } from "../services/ai/aiGeneration.service.js";
import { VideoProvider } from "../services/ai/providers/video.provider.js";
import { HuggingFaceImageProvider } from "../services/ai/providers/huggingFace.provider.js";
import { PollinationsImageProvider } from "../services/ai/providers/pollinations.provider.js";
import { AiGeneration } from "../models/AiGeneration.model.js";

describe("ADOS Free-Tier AI Generation Test Suite", () => {
  describe("1. Video Provider Zero-Cost & Policy Adherence", () => {
    test("video provider status returns CONFIG_REQUIRED when no GPU endpoint configured", () => {
      const status = VideoProvider.getStatus();
      assert.equal(status.isAvailable, false);
      assert.equal(status.status, "CONFIG_REQUIRED");
      assert.ok(status.message.includes("Free-tier AI video generation is not supported"));
      assert.ok(status.instructions.includes("video provider API key") || status.instructions.includes("GPU endpoint"));
    });

    test("video generation never returns fake mock videos or Google CDN samples", async () => {
      // Calling generate rejects with CONFIG_REQUIRED message
      await assert.rejects(
        async () => {
          await VideoProvider.generate();
        },
        (err) => {
          assert.ok(err.message.includes("Free-tier AI video generation is not supported"));
          return true;
        }
      );
    });
  });

  describe("2. Image Provider Quota Error Interception", () => {
    test("HuggingFace provider translates 402/429 into free quota exhausted message", async () => {
      const originalFetch = globalThis.fetch;

      globalThis.fetch = async () => ({
        ok: false,
        status: 402,
        headers: new Headers({ "content-type": "application/json" }),
        json: async () => ({ error: "Credit balance is zero" }),
      });

      try {
        await assert.rejects(
          async () => {
            await HuggingFaceImageProvider.generate({
              prompt: "A luxury watch on dark marble",
              width: 1024,
              height: 1024,
              token: "hf_test_mock_token_12345",
            });
          },
          (err) => {
            assert.equal(err.statusCode, 429);
            assert.ok(
              err.message.includes("Free generation limit reached"),
              `Expected 'Free generation limit reached' but got: ${err.message}`
            );
            return true;
          }
        );
      } finally {
        globalThis.fetch = originalFetch;
      }
    });

    test("Pollinations provider generates legitimate URL parameters without API keys", async () => {
      const result = await PollinationsImageProvider.generate({
        prompt: "Neon cyberpunk city billboard",
        width: 1200,
        height: 675,
      });

      assert.ok(result.imageUrl, "imageUrl should be returned");
      assert.ok(result.imageUrl.startsWith("https://image.pollinations.ai/prompt/"));
      assert.ok(result.imageUrl.includes("width=1200"));
      assert.ok(result.imageUrl.includes("height=675"));
      assert.equal(result.provider, "pollinations");
      assert.equal(result.model, "flux-community");
    });
  });

  describe("3. Prompt Enhancement Engine", () => {
    test("enhances user prompt with high-converting visual advertising tokens", () => {
      const rawPrompt = "minimalist perfume bottle";
      const enhanced = AiGenerationService.enhancePrompt(rawPrompt, "photorealistic");

      assert.ok(enhanced.includes(rawPrompt));
      assert.ok(enhanced.includes("lighting"));
      assert.ok(enhanced.includes("photorealistic"));
    });

    test("handles cinematic and custom styles accurately", () => {
      const enhanced = AiGenerationService.enhancePrompt("sports car in rain", "cinematic");
      assert.ok(enhanced.includes("cinematic"));
      assert.ok(enhanced.includes("sports car in rain"));
    });
  });

  describe("4. Daily Quota Guard & Limit Enforcement", () => {
    test("rejects generation when daily limit is reached with 429 status", async () => {
      // Temporarily mock AiGeneration.countDocuments to return the daily limit (10)
      const originalCount = AiGeneration.countDocuments;
      AiGeneration.countDocuments = async () => 10;

      try {
        await assert.rejects(
          async () => {
            await AiGenerationService.generateImage("507f1f77bcf86cd799439099", {
              prompt: "Coffee cup splash",
            });
          },
          (err) => {
            assert.equal(err.statusCode, 429);
            assert.ok(
              err.message.includes("Free generation limit reached"),
              `Expected limit reached message, got: ${err.message}`
            );
            return true;
          }
        );
      } finally {
        AiGeneration.countDocuments = originalCount;
      }
    });

    test("getQuota returns accurate remaining free generations", async () => {
      const originalCount = AiGeneration.countDocuments;
      AiGeneration.countDocuments = async () => 4;

      try {
        const quota = await AiGenerationService.getQuota("507f1f77bcf86cd799439099");
        assert.equal(quota.dailyLimit, 10);
        assert.equal(quota.usedToday, 4);
        assert.equal(quota.remainingToday, 6);
        assert.ok(quota.resetsAt instanceof Date);
      } finally {
        AiGeneration.countDocuments = originalCount;
      }
    });
  });
});
