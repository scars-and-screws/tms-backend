import prisma from "../../../core/database/prisma.js";

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
    },
    create: data,
  });
};
