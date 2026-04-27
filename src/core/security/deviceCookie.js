import { NODE_ENV, DEVICE_COOKIE_MAX_AGE } from "../config/env.js";

// ! FUNCTION TO SET A DEVICE ID IN AN HTTP-ONLY COOKIE

export const setDeviceCookie = (res, deviceId) => {
  res.cookie("deviceId", deviceId, {
    httpOnly: true,
    secure: NODE_ENV === "production",
    sameSite: "strict",
    maxAge: DEVICE_COOKIE_MAX_AGE,
  });
};
