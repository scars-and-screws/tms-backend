import prisma from "../../../core/database/prisma.js";

// ! FIND USER BY ID
export const findUserById = userId => {
  return prisma.user.findUnique({
    where: { id: userId },
  });
};

// ! FIND USER BY USERNAME
export const findUserByUsername = username => {
  return prisma.user.findUnique({
    where: { username },
  });
};

// ! UPDATE USER PROFILE
export const updateUser = (userId, data) => {
  return prisma.user.update({
    where: { id: userId },
    data,
  });
};
