import app from "./src/app.js";
import { env } from "./src/config/env.js";
import { dbConnection } from "./src/config/db.js";

let server; // Active HTTP server instance

/**
 * Graceful Teardown Handler
 * Ensures in-flight HTTP requests finish and database connection drops cleanly.
 * @param {string} signal - Signal name (e.g., SIGINT, SIGTERM, UncaughtException)
 * @param {number} exitCode - Exit code
 */
const gracefulShutdown = async (signal, exitCode = 0) => {
  console.log(`\n🛑 Received ${signal}. Commencing graceful shutdown...`);

  // Stop accepting incoming connections
  if (server) {
    server.close(async () => {
      console.log("🔒 HTTP server closed.");
      try {
        await dbConnection.disconnect();
        console.log("👋 Graceful shutdown complete. Exiting.");
        process.exit(exitCode);
      } catch (err) {
        console.error("❌ Error during teardown:", err);
        process.exit(1);
      }
    });
  } else {
    await dbConnection.disconnect();
    process.exit(exitCode);
  }

  // Force shutdown after timeout in case pending requests hang
  setTimeout(() => {
    console.error("⚠️ Forced shutdown after 10s timeout.");
    process.exit(1);
  }, 10000).unref();
};

/**
 * Application Bootstrap
 */
const bootstrap = async () => {
  try {
    // 1. Connect to MongoDB
    console.log("⏳ Initializing database connection...");
    await dbConnection.connect();

    // 2. Start HTTP Server
    server = app.listen(env.PORT, () => {
      console.log(`
=====================================================
🚀 ADOS Enterprise Auth API Server Operational
📡 Environment : ${env.NODE_ENV}
🌐 Listening on: http://localhost:${env.PORT}
🩺 Health Check: http://localhost:${env.PORT}/api/v1/health
🔐 Auth Base   : http://localhost:${env.PORT}/api/v1/auth
=====================================================
      `);
    });
  } catch (error) {
    console.error("❌ Fatal bootstrap error:", error.message);
    if (
      error.message?.includes("buffering timed out") ||
      error.message?.includes("ETIMEDOUT") ||
      error.message?.includes("whitelist") ||
      error.name === "MongooseServerSelectionError"
    ) {
      console.error(
        "👉 Tip: Verify your IP address is whitelisted in MongoDB Atlas Network Access (or set to 0.0.0.0/0 for development): https://cloud.mongodb.com/",
      );
    }
    process.exit(1);
  }
};

// Global Process Signal & Crash Handlers
process.on("SIGTERM", () => gracefulShutdown("SIGTERM", 0));
process.on("SIGINT", () => gracefulShutdown("SIGINT", 0));

process.on("uncaughtException", (error) => {
  console.error("💥 Uncaught Exception:", error);
  gracefulShutdown("uncaughtException", 1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("💥 Unhandled Rejection at:", promise, "reason:", reason);
  gracefulShutdown("unhandledRejection", 1);
});

// Launch server
bootstrap();
