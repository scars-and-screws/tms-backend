import prisma from "../../../core/database/prisma.js";

// ! FIND USER FOR VERIFICATION BY USER ID
export const findUserForVerification = userId => {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      isEmailVerified: true,
    },
  });
};

// ! UPDATE USER EMAIL VERIFICATION STATUS
export const markEmailVerified = async userId => {
  return prisma.user.update({
    where: { id: userId },
    data: { isEmailVerified: true },
  });
};
