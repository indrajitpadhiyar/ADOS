import { ApiError } from "../../../utils/ApiError.js";

/**
 * Provider-independent interface for Video Generation.
 *
 * In accordance with strict safety requirements:
 * Free-tier serverless video generation is currently NOT offered by cloud AI providers without paid GPU compute.
 * This provider cleanly reports configuration requirements and never returns fake/mock videos.
 */
export class VideoProvider {
  static get name() {
    return "unconfigured";
  }

  /**
   * Returns current video provider availability status
   * @returns {{ isAvailable: boolean, status: string, message: string }}
   */
  static getStatus() {
    return {
      isAvailable: false,
      status: "CONFIG_REQUIRED",
      message:
        "Free-tier AI video generation is not supported by public cloud providers without dedicated GPU compute. Video generation is currently disabled to prevent unauthorized spending.",
      instructions:
        "To enable AI video generation, configure an external dedicated GPU endpoint or an authorized video provider API key in your backend environment variables.",
    };
  }

  /**
   * Generates a video (or returns honest unconfigured error without faking assets)
   */
  static async generate() {
    const status = this.getStatus();
    throw ApiError.badRequest(status.message);
  }
}
