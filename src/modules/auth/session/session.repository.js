import prisma from "../../../core/database/prisma.js";

// ! COUNT ACTIVE SESSIONS FOR A USER
export const countUserSessions = async userId => {
  return await prisma.refreshToken.count({
    where: { userId },
  });
};

// ! GET THE OLDEST SESSION FOR SESSION LIMIT ENFORCEMENT
export const findOldestSession = async userId => {
  return await prisma.refreshToken.findFirst({
    where: { userId },
    orderBy: { createdAt: "asc" },
    select: { id: true },
  });
};

// ! CREATE A NEW SESSION RECORD
export const createSessionRecord = async data => {
  return await prisma.refreshToken.create({
    data,
  });
};

// ! FIND SESSION BY TOKENHASH
export const findSessionByTokenHash = async tokenHash => {
  return await prisma.refreshToken.findUnique({
    where: { tokenHash },
    include: { user: true },
  });
};

// ! DELETE A SESSION BY ID
export const deleteSessionById = async id => {
  return await prisma.refreshToken.delete({
    where: { id },
  });
};

// ! DELETE SESSION BY TOKENHASH
export const deleteSessionByHash = async tokenHash => {
  return await prisma.refreshToken.deleteMany({
    where: { tokenHash },
  });
};

// ! DELETE ALL SESSIONS FOR A USER
export const deleteAllUserSessions = async userId => {
  return await prisma.refreshToken.deleteMany({
    where: { userId },
  });
};

// ! GET SESSIONS FOR A USER
export const findUserSessions = async userId => {
  return await prisma.refreshToken.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
};

// ! FIND SESSION BY DEVICE ID
export const findSessionByDevice = async (userId, deviceId) => {
  return await prisma.refreshToken.findFirst({
    where: { userId, deviceId },
  });
};

// ! UPSERT SESSION (atomic create or update for same device)
export const upserSession = async ({
  userId,
  deviceId,
  tokenHash,
  fingerprint,
  ipAddress,
  userAgent,
  expiresAt,
}) => {
  return await prisma.refreshToken.upsert({
    where: { userId_deviceId: { userId, deviceId } },
    update: {
      tokenHash,
      fingerprint,
      ipAddress,
      userAgent,
      expiresAt,
      lastUsedAt: new Date(),
    },
    create: {
      userId,
      deviceId,
      tokenHash,
      fingerprint,
      ipAddress,
      userAgent,
      expiresAt,
      lastUsedAt: new Date(),
    },
  });
};
