import { ApiError, sanitizeUser } from "../../../core/utils/index.js";
import { hashPassword, comparePassword } from "../../../core/security/index.js";

import {
  findUserById,
  findUserByUsername,
  updateUser,
} from "./profile.repository.js";

import {
  createSessionService,
  revokeAllSessionsService,
} from "../../auth/session/session.service.js";

// ! CURRENT USER PROFILE SERVICE
export const getProfileService = async userId => {
  const user = await findUserById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return sanitizeUser(user);
};

// ! UPDATE USER PROFILE SERVICE
export const updateProfileService = async (userId, data) => {
  // Check if username is being updated and if it's already taken
  if (data.username) {
    const existing = await findUserByUsername(data.username);

    if (existing && existing.id !== userId) {
      throw new ApiError(409, "Username already taken");
    }
  }

  const updatedUser = await updateUser(userId, data);

  return sanitizeUser(updatedUser);
};

// ! CHANGE PASSWORD SERVICE
export const changePasswordService = async (userId, data, meta) => {
  const { currentPassword, newPassword } = data;

  const user = await findUserById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isValid = await comparePassword(currentPassword, user.passwordHash);

  if (!isValid) {
    throw new ApiError(401, "Current password is incorrect");
  }

  if (currentPassword === newPassword) {
    throw new ApiError(400, "New password must be different");
  }

  const passwordHash = await hashPassword(newPassword);

  await updateUser(userId, { passwordHash });

  // Revoke all existing sessions after password change
  await revokeAllSessionsService(userId);
  // Create a new session for the user after password change
  const { accessToken, refreshToken } = await createSessionService(user, meta);

  return { user, accessToken, refreshToken };
};
