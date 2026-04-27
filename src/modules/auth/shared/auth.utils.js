import jwt from "jsonwebtoken";
import { ApiError } from "../../../core/utils/index.js";
import {
  generateDeviceId,
  setDeviceCookie,
  verifyTempToken,
} from "../../../core/security/index.js";

import { getRequestMeta } from "../../../core/utils/index.js";
import { JWT_TEMP_TOKEN_EXPIRATION } from "../../../core/config/env.js";

export const buildAuthMeta = (req, res) => {
  let deviceId = req.cookies.deviceId;
  if (!deviceId) {
    deviceId = generateDeviceId();
    setDeviceCookie(res, deviceId);
  }
  return {
    ...getRequestMeta(req),
    deviceId,
  };
};

export const safeVerifyTempToken = token => {
  try {
    return verifyTempToken(token);
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      throw new ApiError(401, "Session expired. Please login again");
    }

    if (err instanceof jwt.JsonWebTokenError) {
      throw new ApiError(401, "Invalid temporary token");
    }

    throw new ApiError(401, "Authentication failed");
  }
};

export const safeDecodeTempToken = token => {
  try {
    // ignore expiration for decoding
    return jwt.verify(token, JWT_TEMP_TOKEN_EXPIRATION, {
      ignoreExpiration: true,
    });
  } catch (err) {
    throw new ApiError(401, "Invalid temporary token");
  }
};
