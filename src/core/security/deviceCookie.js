import { NODE_ENV, DEVICE_COOKIE_MAX_AGE } from "../config/env.js";
export const setDeviceCookie = (res, deviceId) => {
  res.cookie("deviceId", deviceId, {
    httpOnly: true,
    secure: NODE_ENV === "production",
    sameSite: "strict",
    maxAge: DEVICE_COOKIE_MAX_AGE,
  });
};
