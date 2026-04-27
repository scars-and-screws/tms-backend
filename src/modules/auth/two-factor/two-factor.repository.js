import prisma from "../../../core/database/prisma.js";

// ! FIND USER BY ID
export const findUserById = userId => {
  return prisma.user.findUnique({
    where: { id: userId },
  });
};

// ! ENABLE TWO FACTOR AUTHENTICATION
export const enableTwoFactor = userId => {
  return prisma.user.update({
    where: { id: userId },
    data: { twoFactorEnabled: true },
  });
};

// ! DISABLE TWO FACTOR AUTHENTICATION
export const disableTwoFactor = userId => {
  return prisma.user.update({
    where: { id: userId },
    data: { twoFactorEnabled: false },
  });
};
