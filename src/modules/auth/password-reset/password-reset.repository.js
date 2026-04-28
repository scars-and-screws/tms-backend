import prisma from "../../../core/database/prisma.js";

// ! FIND USER BY EMAIL
export const findUserByEmail = async email => {
  return await prisma.user.findUnique({
    where: { email },
  });
};

// ! UPDATE USER PASSWORD
export const updateUserPassword = async (userId, passwordHash) => {
  return await prisma.user.update({
    where: { id: userId },
    data: { passwordHash },
  });
};

// ! DELETE ALL SESSIONS
export const deleteUserSessions = async userId => {
  return await prisma.refreshToken.deleteMany({
    where: { userId },
  });
};
