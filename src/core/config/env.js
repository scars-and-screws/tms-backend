import "dotenv/config";

const requiredEnv = [
  "DATABASE_URL",
  "JWT_ACCESS_TOKEN_SECRET",
  "JWT_REFRESH_TOKEN_SECRET",
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
  "CLOUDINARY_URL",
  "JWT_TEMP_TOKEN_SECRET",
  "JWT_TEMP_TOKEN_EXPIRATION",
];
// Check for required environment variables and throw an error if any are missing to prevent the application from crashing later on due to missing configuration
requiredEnv.forEach(env => {
  if (!process.env[env]) {
    throw new Error(`Missing required environment variable: ${env}`);
  }
});

export const PORT = process.env.PORT || 5000;
export const DATABASE_URL = process.env.DATABASE_URL;
export const NODE_ENV = process.env.NODE_ENV || "development";
export const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS) || 10;
export const JWT_ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_TOKEN_SECRET;
export const JWT_REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_TOKEN_SECRET;
export const JWT_ACCESS_TOKEN_EXPIRATION =
  process.env.JWT_ACCESS_TOKEN_EXPIRATION || "15m";
export const JWT_REFRESH_TOKEN_EXPIRATION =
  process.env.JWT_REFRESH_TOKEN_EXPIRATION || "7d";
export const JWT_TEMP_TOKEN_SECRET = process.env.JWT_TEMP_TOKEN_SECRET;
export const JWT_TEMP_TOKEN_EXPIRATION =
  process.env.JWT_TEMP_TOKEN_EXPIRATION || "5m";
export const MAX_SESSIONS = parseInt(process.env.MAX_SESSIONS) || 7;
export const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;
export const CLOUDINARY_URL = process.env.CLOUDINARY_URL;
export const DEVICE_COOKIE_MAX_AGE =
  parseInt(process.env.DEVICE_COOKIE_MAX_AGE) || 31536000000; // Default to 365 days in milliseconds
