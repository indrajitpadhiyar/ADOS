import { env } from "../../../config/env.js";
import { ApiError } from "../../../utils/ApiError.js";

const DEFAULT_MODEL = "black-forest-labs/FLUX.1-schnell";

export class HuggingFaceImageProvider {
  static get name() {
    return "huggingface";
  }

  /**
   * Generates an image using Hugging Face Inference Providers API
   * @param {Object} options
   * @param {string} options.prompt - Refined image prompt
   * @param {number} [options.width=1024]
   * @param {number} [options.height=1024]
   * @param {number} [options.seed]
   * @param {string} [options.model]
   * @returns {Promise<{ imageUrl: string, provider: string, model: string, seed: number }>}
   */
  static async generate({ prompt, width = 1024, height = 1024, seed = null, model = null, token = null }) {
    const activeToken = token || env.HF_TOKEN;
    if (!activeToken) {
      throw ApiError.badRequest(
        "Hugging Face API token (HF_TOKEN) is not configured in backend environment variables."
      );
    }

    const selectedModel = model || DEFAULT_MODEL;
    const finalSeed = seed || Math.floor(Math.random() * 1000000);

    // Call Hugging Face Inference Router
    const endpoint = `https://router.huggingface.co/hf-inference/models/${selectedModel}`;

    let response;
    try {
      response = await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${activeToken}`,
          "Content-Type": "application/json",
          Accept: "image/png, image/jpeg",
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            width: Math.min(width, 1024),
            height: Math.min(height, 1024),
            seed: finalSeed,
          },
        }),
      });
    } catch (networkErr) {
      throw ApiError.internal(`Network error reaching Hugging Face API: ${networkErr.message}`);
    }

    // Zero-spend enforcement: handle quota and payment errors strictly
    if (response.status === 402 || response.status === 429) {
      throw ApiError.tooManyRequests(
        "Free generation limit reached. Hugging Face free-tier compute credits have been exhausted for this period."
      );
    }

    if (!response.ok) {
      const errJson = await response.json().catch(() => ({}));
      const errMsg = errJson.error || errJson.message || `HTTP ${response.status} from Hugging Face`;

      if (
        errMsg.toLowerCase().includes("quota") ||
        errMsg.toLowerCase().includes("credit") ||
        errMsg.toLowerCase().includes("payment") ||
        errMsg.toLowerCase().includes("rate limit")
      ) {
        throw ApiError.tooManyRequests("Free generation limit reached. Please try again tomorrow.");
      }

      throw ApiError.badRequest(`Hugging Face inference error: ${errMsg}`);
    }

    // Convert returned binary image buffer to Data URL
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const contentType = response.headers.get("content-type") || "image/png";
    const base64Data = buffer.toString("base64");
    const dataUrl = `data:${contentType};base64,${base64Data}`;

    return {
      imageUrl: dataUrl,
      provider: "huggingface",
      model: selectedModel,
      seed: finalSeed,
    };
  }
}
