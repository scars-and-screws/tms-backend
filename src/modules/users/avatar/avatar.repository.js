import prisma from "../../../core/database/prisma.js";

// ! FIND USER AVATAR DATA
export const findUserAvatar = userId => {
  return prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, avatarPublicId: true },
  });
};

// ! UPDATE USER AVATAR
export const updateUserAvatar = (userId, data) => {
  return prisma.user.update({
    where: { id: userId },
    data,
  });
};
