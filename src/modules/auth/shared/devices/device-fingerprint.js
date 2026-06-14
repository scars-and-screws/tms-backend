import crypto from "crypto";

// ! FUNCTION TO GENERATE A FINGERPRINT FOR A DEVICE BASED ON THE DEVICE ID AND USER AGENT STRING.

export const generateFingerprint = (deviceId, userAgent) => {
  const rawFingerprint = `${deviceId}:${userAgent}`;
  return crypto.createHash("sha256").update(rawFingerprint).digest("hex");
};
