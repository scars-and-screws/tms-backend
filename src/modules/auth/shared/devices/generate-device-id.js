import crypto from "crypto";

// ! FUNCTION TO GENERATE A UNIQUE DEVICE ID
export const generateDeviceId = () => {
  return crypto.randomUUID();
};
