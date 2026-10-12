import { Router } from "express";
import mongoose from "mongoose";
import authRoutes from "./auth.routes.js";
import adRoutes from "./ad.routes.js";
import accountRoutes from "./account.routes.js";
import teamRoutes from "./team.routes.js";
import settingsRoutes from "./settings.routes.js";
import googleAdsRoutes from "./googleAds.routes.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const apiRouter = Router();

/**
 * Health & Telemetry Probe
 * Useful for Docker/Kubernetes readiness and liveness probes
 */
apiRouter.get("/health", (req, res) => {
  const isDbConnected = mongoose.connection.readyState === 1;

  const healthData = {
    status: isDbConnected ? "HEALTHY" : "DEGRADED",
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    services: {
      database: isDbConnected ? "connected" : "disconnected",
    },
    memoryUsageMB: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
  };

  return ApiResponse.success(res, "System health report", healthData);
});

/**
 * Mount Resource Routes
 */
apiRouter.use("/auth", authRoutes);
apiRouter.use("/ads", adRoutes);
apiRouter.use("/accounts", accountRoutes);
apiRouter.use("/team", teamRoutes);
apiRouter.use("/settings", settingsRoutes);
apiRouter.use("/google-ads", googleAdsRoutes);

export default apiRouter;

