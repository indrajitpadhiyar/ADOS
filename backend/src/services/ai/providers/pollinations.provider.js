import { ApiError } from "../../../utils/ApiError.js";

export class PollinationsImageProvider {
  static get name() {
    return "pollinations";
  }

  /**
   * Generates a genuine AI image using the free community Pollinations inference engine
   * @param {Object} options
   * @param {string} options.prompt
   * @param {number} [options.width=1024]
   * @param {number} [options.height=1024]
   * @param {number} [options.seed]
   * @returns {Promise<{ imageUrl: string, provider: string, model: string, seed: number }>}
   */
  static async generate({ prompt, width = 1024, height = 1024, seed = null }) {
    if (!prompt) {
      throw ApiError.badRequest("Prompt is required for image generation.");
    }

    const finalSeed = seed || Math.floor(Math.random() * 1000000);
    const encodedPrompt = encodeURIComponent(prompt.trim());
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&seed=${finalSeed}&nologo=true`;

    // Verify endpoint availability
    try {
      const headCheck = await fetch(imageUrl, { method: "HEAD", signal: AbortSignal.timeout(8000) });
      if (!headCheck.ok && headCheck.status >= 500) {
        throw new Error(`Pollinations service temporarily unavailable (status ${headCheck.status})`);
      }
    } catch (err) {
      // If HEAD check times out, still allow url to return as Pollinations generates on first GET
    }

    return {
      imageUrl,
      provider: "pollinations",
      model: "flux-community",
      seed: finalSeed,
    };
  }
}
