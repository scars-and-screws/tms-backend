import crypto from "crypto";

export const generateDeviceId = () => {
  return crypto.randomUUID();
};
