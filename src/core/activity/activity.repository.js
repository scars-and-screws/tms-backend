import prisma from "../../core/database/prisma.js";

// ! CREATE ACTIVITY RECORD
export const createActivity = async data => {
  return prisma.activity.create({
    data,
  });
};
