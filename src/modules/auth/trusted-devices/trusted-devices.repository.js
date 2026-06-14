import prisma from "../../../infrastructure/database/prisma.js";
import { getTrustedDeviceExpiry } from "./helpers/trusted-device-expiry.js";

// ! FIND TRUSTED DEVICE
export const findTrustedDevice = async (userId, deviceId) => {
  return prisma.trustedDevice.findUnique({
    where: {
      userId_deviceId: {
        userId,
        deviceId,
      },
    },
  });
};

// ! CREATE TRUSTED DEVICE
export const upsertTrustedDevice = async data => {
  return prisma.trustedDevice.upsert({
    where: {
      userId_deviceId: {
        userId: data.userId,
        deviceId: data.deviceId,
      },
    },

    update: {
      fingerprint: data.fingerprint,
      expiresAt: getTrustedDeviceExpiry(),
      lastUsedAt: new Date(),
    },

    create: {
      ...data,
      expiresAt: getTrustedDeviceExpiry(),
      lastUsedAt: new Date(),
    },
  });
};

// ! DELETE DEVICE
export const deleteTrustedDevice = id => {
  return prisma.trustedDevice.delete({
    where: {
      id,
    },
  });
};

// ! TOUCH DEVICE
export const touchTrustedDevice = id => {
  return prisma.trustedDevice.update({
    where: {
      id,
    },

    data: {
      lastUsedAt: new Date(),
    },
  });
};
