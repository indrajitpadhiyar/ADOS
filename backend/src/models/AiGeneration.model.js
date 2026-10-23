import mongoose from "mongoose";

const aiGenerationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["image", "video"],
      required: true,
      default: "image",
      index: true,
    },
    prompt: {
      type: String,
      required: [true, "Prompt is required"],
      trim: true,
      maxlength: 1000,
    },
    enhancedPrompt: {
      type: String,
      default: null,
      trim: true,
    },
    provider: {
      type: String,
      required: true,
      trim: true,
    },
    model: {
      type: String,
      default: null,
      trim: true,
    },
    status: {
      type: String,
      enum: ["completed", "failed", "unconfigured"],
      default: "completed",
      index: true,
    },
    outputUrl: {
      type: String,
      default: null,
    },
    metadata: {
      width: { type: Number, default: 1024 },
      height: { type: Number, default: 1024 },
      size: { type: String, default: "square" },
      style: { type: String, default: "photorealistic" },
      seed: { type: Number, default: null },
    },
    errorMessage: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Compound index to quickly count daily user usage
aiGenerationSchema.index({ userId: 1, type: 1, createdAt: -1 });

export const AiGeneration = mongoose.model("AiGeneration", aiGenerationSchema);
