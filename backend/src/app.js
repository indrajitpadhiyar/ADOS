import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import morgan from "morgan";

import { env } from "./config/env.js";
import { apiLimiter } from "./middlewares/rateLimiter.middleware.js";
import { mongoSanitize } from "./middlewares/mongoSanitize.middleware.js";
import { notFoundHandler } from "./middlewares/notFound.middleware.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import apiRouter from "./routes/index.js";

const app = express();

/**
 * 1. Trust Proxy Configuration
 * Required for rate-limiters and secure cookies when deployed behind reverse proxies (Nginx, ALB, Cloudflare)
 */
app.set("trust proxy", 1);

/**
 * 2. Enterprise Security HTTP Headers (Helmet)
 * Enforces Clickjacking protection, strict MIME sniffing guards, and secure framing
 */
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        frameAncestors: ["'none'"], // Completely prevent framing / Clickjacking
        objectSrc: ["'none'"],
        scriptSrc: ["'self'"],
      },
    },
    crossOriginEmbedderPolicy: false,
    frameguard: { action: "deny" },
    hsts:
      env.NODE_ENV === "production"
        ? {
            maxAge: 31536000, // 1 year
            includeSubDomains: true,
            preload: true,
          }
        : false,
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },
    noSniff: true,
    dnsPrefetchControl: { allow: false },
  })
);

/**
 * 3. Strict Cross-Origin Resource Sharing (CORS)
 * Mitigates CSRF and unauthorized cross-origin requests
 */
const configuredOrigins = (env.CORS_ORIGIN || "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

const allowedOrigins = [
  ...configuredOrigins,
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://ados-44jf.onrender.com",
  "https://ados-4hxi.onrender.com",
  "https://idrtech.in",
  "https://www.idrtech.in",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. server-to-server or curl in dev)
      if (!origin) {
        return callback(null, true);
      }
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      // Allow any official Render deployment subdomains (e.g. ados-4hxi.onrender.com)
      try {
        const hostname = new URL(origin).hostname;
        if (hostname.endsWith(".onrender.com") || hostname === "idrtech.in" || hostname === "www.idrtech.in") {
          return callback(null, true);
        }
      } catch {
        // invalid URL format
      }
      // Rejects disallowed origins cleanly without throwing uncaught 500 exceptions
      return callback(null, false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    exposedHeaders: ["RateLimit-Limit", "RateLimit-Remaining", "RateLimit-Reset"],
    maxAge: 86400, // Preflight caching for 24h
  })
);

/**
 * 4. Request Logging (Omits sensitive payload information)
 */
if (env.NODE_ENV !== "test") {
  app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));
}

/**
 * 5. Body Parsers & Payload Size Constraints
 * Enforce strict 16kb limit to mitigate Denial-of-Service (DoS) buffer exhaustion attacks
 */
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

/**
 * 6. NoSQL Operator & Prototype Pollution Defense
 * Recursively strips keys prefixed with '$' or containing '.'
 */
app.use(mongoSanitize);

/**
 * 7. Cookie Parser with Cryptographic Signature Support
 */
app.use(cookieParser(env.COOKIE_SECRET));

/**
 * 8. Global API Rate Limiter
 */
app.use("/api", apiLimiter);

/**
 * 8.5. Graceful URL Normalization
 * Automatically rewrites legacy / unversioned /auth/* requests to /api/v1/auth/*
 * Ensures full backward compatibility without defining duplicate route handlers.
 */
app.use((req, res, next) => {
  if (req.url.startsWith("/auth/")) {
    req.url = `/api/v1${req.url}`;
  } else if (req.url === "/auth") {
    req.url = "/api/v1/auth";
  }
  next();
});

/**
 * 9. Mount Versioned Application Routes
 */
app.use("/api/v1", apiRouter);

/**
 * 10. 404 Route Not Found Catcher
 */
app.use(notFoundHandler);

/**
 * 11. Centralized Error Handler (Must be registered last)
 */
app.use(errorHandler);

export default app;
