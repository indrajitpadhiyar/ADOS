import dotenv from "dotenv";
import { z } from "zod";

// Load .env variables
dotenv.config();

const isTest = process.env.NODE_ENV === "test" || process.argv.includes("--test") || process.argv.some((a) => a.includes("test"));

// Schema definition for strict environment variable validation
const envSchema = z.object({
  PORT: z.coerce.number().default(5000),
  NODE_ENV: z.enum(["development", "production", "test"]).default(isTest ? "test" : "development"),
  MONGO_URL: isTest ? z.string().default("mongodb://localhost:27017/test") : z.string().min(1, "MONGO_URL is required"),
  CORS_ORIGIN: z.string().default("http://localhost:5173"),
  JWT_ACCESS_SECRET: isTest ? z.string().default("test_jwt_access_secret_1234567890_super_safe") : z.string().min(16, "JWT_ACCESS_SECRET must be at least 16 characters long"),
  JWT_ACCESS_EXPIRES_IN: z.string().default("7d"),
  JWT_REFRESH_SECRET: isTest ? z.string().default("test_jwt_refresh_secret_1234567890_super_safe") : z.string().min(16, "JWT_REFRESH_SECRET must be at least 16 characters long"),
  JWT_REFRESH_EXPIRES_IN: z.string().default("7d"),
  COOKIE_SECRET: isTest ? z.string().default("test_cookie_secret_1234567890_super_safe") : z.string().min(16, "COOKIE_SECRET must be at least 16 characters long"),
  RESEND_API_KEY: z.string().optional(),
  EMAIL_FROM: z.string().default("ADOS <onboarding@resend.dev>"),
  EMAIL_USER: z.string().optional(),
  EMAIL_PASS: z.string().optional(),
  APP_URL: z.string().url("APP_URL must be a valid URL").default(
    (process.env.NODE_ENV === "production" && (!process.env.APP_URL || process.env.APP_URL.includes("ados-44jf.onrender.com")))
      ? "https://adoshub.online"
      : (process.env.APP_URL || (process.env.NODE_ENV === "production" ? "https://adoshub.online" : "http://localhost:5173"))
  ),
  EMAIL_VERIFICATION_EXPIRES_MINUTES: z.coerce.number().default(60),
  GOOGLE_CLIENT_ID: z.string().optional().default(process.env.GOOGLE_CLIENT_ID || process.env.GOOGLE_ADS_CLIENT_ID || process.env.GOOGLE_ADS_CLINT_ID || "821131046800-porffpf9he7l4b7v61gfo0gs6bg7fjmu.apps.googleusercontent.com"),
  GOOGLE_CLIENT_SECRET: z.string().optional().default(process.env.GOOGLE_CLIENT_SECRET || process.env.GOOGLE_ADS_CLIENT_SECRET || process.env.GOOGLE_ADS_CLINT_SCRIPT || (isTest ? "test_google_client_secret_xyz" : "")),
  GOOGLE_CALLBACK_URL: z.string().default(
    (process.env.NODE_ENV === "production" && (!process.env.GOOGLE_CALLBACK_URL || process.env.GOOGLE_CALLBACK_URL.includes("localhost")))
      ? "https://adosbackend.onrender.com/auth"
      : (process.env.GOOGLE_CALLBACK_URL || (process.env.NODE_ENV === "production" ? "https://adosbackend.onrender.com/auth" : "http://localhost:5000/auth"))
  ),
  GOOGLE_ADS_CLIENT_ID: z.string().optional().default(process.env.GOOGLE_ADS_CLIENT_ID || process.env.GOOGLE_ADS_CLINT_ID || process.env.GOOGLE_CLIENT_ID || "821131046800-porffpf9he7l4b7v61gfo0gs6bg7fjmu.apps.googleusercontent.com"),
  GOOGLE_ADS_CLIENT_SECRET: z.string().optional().default(process.env.GOOGLE_ADS_CLIENT_SECRET || process.env.GOOGLE_ADS_CLINT_SCRIPT || process.env.GOOGLE_CLIENT_SECRET || (isTest ? "test_google_client_secret_xyz" : "")),
  GOOGLE_ADS_CLINT_ID: z.string().optional().default(process.env.GOOGLE_ADS_CLINT_ID || ""),
  GOOGLE_ADS_CLINT_SCRIPT: z.string().optional().default(process.env.GOOGLE_ADS_CLINT_SCRIPT || ""),
  GOOGLE_ADS_REDIRECT_URI: z.string().default(
    (process.env.NODE_ENV === "production" && (process.env.GOOGLE_ADS_REDIRECT_URI?.includes("localhost") || !process.env.GOOGLE_ADS_REDIRECT_URI))
      ? "https://adosbackend.onrender.com/api/v1/google-ads/callback"
      : (process.env.GOOGLE_ADS_REDIRECT_URI ||
        (process.env.NODE_ENV === "production"
          ? "https://adosbackend.onrender.com/api/v1/google-ads/callback"
          : "http://localhost:5000/api/v1/google-ads/callback"))
  ),
  GOOGLE_ADS_DEVELOPER_TOKEN: z.string().optional().default(process.env.GOOGLE_ADS_DEVELOPER_TOKEN || ""),
  META_APP_ID: z.string().optional().default(process.env.META_APP_ID || process.env.FACEBOOK_APP_ID || (isTest ? "123456789012345" : "")),
  META_APP_SECRET: z.string().optional().default(process.env.META_APP_SECRET || process.env.FACEBOOK_APP_SECRET || (isTest ? "test_meta_app_secret_abc123" : "")),
  META_GRAPH_VERSION: z.string().default(process.env.META_GRAPH_VERSION || process.env.META_API_VERSION || "v19.0"),
  META_API_VERSION: z.string().default(process.env.META_API_VERSION || process.env.META_GRAPH_VERSION || "v19.0"),
  META_LOGIN_CONFIG_ID: z.string().optional().default(process.env.META_LOGIN_CONFIG_ID || ""),
  META_CALLBACK_URL: z.string().default(
    (process.env.NODE_ENV === "production" && (!process.env.META_CALLBACK_URL || process.env.META_CALLBACK_URL.includes("localhost")))
      ? "https://adosbackend.onrender.com/api/v1/meta/callback"
      : (process.env.META_CALLBACK_URL || process.env.META_REDIRECT_URI || (process.env.NODE_ENV === "production" ? "https://adosbackend.onrender.com/api/v1/meta/callback" : "http://localhost:5000/api/v1/meta/callback"))
  ),
  META_REDIRECT_URI: z.string().default(
    (process.env.NODE_ENV === "production" && (!process.env.META_REDIRECT_URI || process.env.META_REDIRECT_URI.includes("localhost")))
      ? "https://adosbackend.onrender.com/api/v1/meta/callback"
      : (process.env.META_REDIRECT_URI || process.env.META_CALLBACK_URL || (process.env.NODE_ENV === "production" ? "https://adosbackend.onrender.com/api/v1/meta/callback" : "http://localhost:5000/api/v1/meta/callback"))
  ),
  ENCRYPTION_KEY: z.string().optional().default(process.env.ENCRYPTION_KEY || ""),
  HF_TOKEN: z.string().optional().default(process.env.HF_TOKEN || ""),
  AI_IMAGE_PROVIDER: z.enum(["huggingface", "pollinations"]).default((process.env.AI_IMAGE_PROVIDER === "huggingface" || process.env.HF_TOKEN) ? "huggingface" : "pollinations"),
  AI_FREE_DAILY_LIMIT: z.coerce.number().default(10),
});

const parseEnv = () => {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    console.error("❌ Critical Environment Validation Failure:");
    result.error.issues.forEach((issue) => {
      console.error(`   - ${issue.path.join(".")}: ${issue.message}`);
    });
    process.exit(1);
  }

  return Object.freeze(result.data);
};

export const env = parseEnv();
