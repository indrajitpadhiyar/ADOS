import dns from "node:dns";
import mongoose from "mongoose";
import { env } from "./env.js";

// Configure Node.js DNS resolver with reliable public DNS servers (Google & Cloudflare)
// This resolves 'querySrv ESERVFAIL' and 'queryTxt ESERVFAIL' errors where local ISP/router DNS fails to resolve MongoDB SRV records.
try {
  dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);
} catch (dnsError) {
  console.warn("⚠️ Failed to set custom DNS servers:", dnsError.message);
}

/**
 * MongoDB Enterprise-Grade Connection Manager
 * Features:
 * - Connection pooling (minPoolSize, maxPoolSize)
 * - Auto-reconnect handling
 * - Event-driven telemetry
 * - Graceful teardown
 */
class DatabaseConnection {
  constructor() {
    this.isConnected = false;
    this.isShuttingDown = false;
  }

  async connect(retries = 3, delayMs = 2000) {
    if (this.isConnected) {
      console.log("ℹ️ MongoDB is already connected.");
      return;
    }

    const mongooseOptions = {
      maxPoolSize: 10,
      minPoolSize: 2,
      socketTimeoutMS: 45000,
      serverSelectionTimeoutMS: 30000,
      heartbeatFrequencyMS: 10000,
      autoIndex: env.NODE_ENV !== "production", // Don't auto-build indexes in high-scale prod
    };

    // Attach event listeners prior to opening connection
    mongoose.connection.on("connected", () => {
      this.isConnected = true;
      console.log(`✅ MongoDB Connected successfully [Host: ${mongoose.connection.host}, DB: ${mongoose.connection.name}]`);
    });

    mongoose.connection.on("error", (err) => {
      this.isConnected = false;
      console.error("❌ MongoDB connection error:", err.message);
    });

    mongoose.connection.on("disconnected", () => {
      this.isConnected = false;
      if (!this.isShuttingDown) {
        console.warn("⚠️ MongoDB disconnected. Attempting reconnection...");
      }
    });

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        await mongoose.connect(env.MONGO_URL, mongooseOptions);
        return;
      } catch (error) {
        console.error(`❌ MongoDB Connection Attempt ${attempt}/${retries} Failed: ${error.message}`);
        if (attempt < retries) {
          console.log(`⏳ Retrying MongoDB connection in ${delayMs / 1000}s...`);
          await new Promise((resolve) => setTimeout(resolve, delayMs));
        } else {
          throw error;
        }
      }
    }
  }

  async disconnect() {
    if (!this.isConnected) return;
    try {
      this.isShuttingDown = true;
      await mongoose.connection.close(false);
      this.isConnected = false;
      console.log("🛑 MongoDB connection cleanly closed.");
    } catch (error) {
      console.error("❌ Error during MongoDB disconnection:", error.message);
    }
  }
}

export const dbConnection = new DatabaseConnection();
