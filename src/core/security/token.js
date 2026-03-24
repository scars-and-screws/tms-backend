import {
  JWT_ACCESS_TOKEN_SECRET,
  JWT_ACCESS_TOKEN_EXPIRATION,
  JWT_REFRESH_TOKEN_SECRET,
  JWT_REFRESH_TOKEN_EXPIRATION,
} from "../config/env.js";
import jwt from "jsonwebtoken";

// Generates a JWT access token for a given user ID using the secret and expiration time defined in the environment configuration
export const generateAccessToken = payload => {
  return jwt.sign(payload, JWT_ACCESS_TOKEN_SECRET, {
    expiresIn: JWT_ACCESS_TOKEN_EXPIRATION,
  });
};

// Generates a JWT refresh token for a given user ID using the secret and expiration time defined in the environment configuration
export const generateRefreshToken = payload => {
  return jwt.sign(payload, JWT_REFRESH_TOKEN_SECRET, {
    expiresIn: JWT_REFRESH_TOKEN_EXPIRATION,
  });
};

// Verifies a JWT access token using the secret defined in the environment configuration, returning the decoded payload if valid or throwing an error if invalid
export const verifyAccessToken = token => {
  return jwt.verify(token, JWT_ACCESS_TOKEN_SECRET);
};

// Verifies a JWT refresh token using the secret defined in the environment configuration, returning the decoded payload if valid or throwing an error if invalid
export const verifyRefreshToken = token => {
  return jwt.verify(token, JWT_REFRESH_TOKEN_SECRET);
};
