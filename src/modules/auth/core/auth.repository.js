import prisma from "../../../core/database/prisma.js";

// ! FIND USER BY EMAIL OR USERNAME
export const findUserByIdentifier = async identifier => {
  return prisma.user.findFirst({
    where: {
      OR: [{ email: identifier }, { username: identifier }],
    },
  });
};

// ! FIND USER BY EMAIL OR USERNAME (REGISTER CHECK FOR DUPLICATES)
export const findUserByEmailOrUsername = async (email, username) => {
  return prisma.user.findFirst({
    where: {
      OR: [{ email }, { username }],
    },
  });
};

// ! CREATE NEW USER
export const createUser = async data => {
  return prisma.user.create({
    data,
  });
};
