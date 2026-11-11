import mongoose from "mongoose";

const dataDeletionRequestSchema = new mongoose.Schema(
  {
    confirmationCode: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    platform: {
      type: String,
      required: true,
      default: "meta",
      index: true,
    },
    platformUserId: {
      type: String,
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "COMPLETED", "FAILED"],
      default: "COMPLETED",
    },
    details: {
      deletedCredentialsCount: { type: Number, default: 0 },
      deletedAccountsCount: { type: Number, default: 0 },
      deletedConnectionsCount: { type: Number, default: 0 },
      message: { type: String, default: "" },
    },
    requestedAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const DataDeletionRequest = mongoose.model(
  "DataDeletionRequest",
  dataDeletionRequestSchema
);
