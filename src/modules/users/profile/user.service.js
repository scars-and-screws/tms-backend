import prisma from "../../../core/database/prisma.js";
import { ApiError, sanitizeUser } from "../../../core/utils/index.js";
import { hashPassword, comparePassword } from "../../../core/security/index.js";
import {
  createSessionService,
  revokeAllSessionsService,
} from "../../auth/session/index.js";

// ! CURRENT USER PROFILE SERVICE
export const getProfileService = async userId => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  return sanitizeUser(user);
};

// ! UPDATE USER PROFILE SERVICE
export const updateProfileService = async (userId, data) => {
  // Check if username is being updated and if it's already taken
  if (data.username) {
    const existingUsername = await prisma.user.findUnique({
      where: { username: data.username },
    });
    if (existingUsername && existingUsername.id !== userId) {
      throw new ApiError(409, "Username already taken");
    }
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data,
  });

  return sanitizeUser(updatedUser);
};

// ! CHANGE PASSWORD SERVICE
export const changePasswordService = async (userId, data, meta) => {
  const { currentPassword, newPassword } = data;
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }
  const validPassword = await comparePassword(
    currentPassword,
    user.passwordHash
  );
  if (!validPassword) {
    throw new ApiError(401, "Current password is incorrect");
  }

  const newPasswordHash = await hashPassword(newPassword);
  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash: newPasswordHash },
  });
  // Revoke all existing sessions after password change
  await revokeAllSessionsService(userId);
  const { accessToken, refreshToken } = await createSessionService(user, meta);
  return { user, accessToken, refreshToken };
};
