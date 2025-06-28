import dotenv from "dotenv";

dotenv.config();

const envConfig = {
  PORT: process.env.PORT || 8007,
  MONGODB_URI: process.env.MONGODB_URI || "",
  CORS_ORIGIN: process.env.CORS_ORIGIN,

  // JWT Configuration
  JWT_SECRET: process.env.JWT_SECRET || 'jwt-secret',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '10m',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'jwt-refresh-secret',
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '5h',

  IS_DEVELOPMENT: process.env.NODE_ENV === "development",
  IS_PRODUCTION: process.env.NODE_ENV === "production",

  AI_SERVICE_URL: process.env.AI_SERVICE_URL || "",
  AI_API_KEY: process.env.AI_API_KEY || "",
} as const;

export default envConfig;