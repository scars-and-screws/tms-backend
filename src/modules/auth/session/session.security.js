import { generateFingerprint } from "../../../core/security/index.js";

// ! VERIFY SESSION FINGERPRINT (prevents stolen refresh tokens from being used on different devices)
export const verifySessionFingerprint = (session, meta) => {
  const { deviceId, userAgent } = meta;

  const currentFingerprint = generateFingerprint(deviceId, userAgent);

  return session.fingerprint === currentFingerprint;
};
