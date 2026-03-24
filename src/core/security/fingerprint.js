import crypto from "crypto";

export const generateFingerprint = (deviceId, userAgent) => {
  const rawFingerprint = `${deviceId}:${userAgent}`;
  return crypto.createHash("sha256").update(rawFingerprint).digest("hex");
};
