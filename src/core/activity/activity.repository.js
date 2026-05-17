import prisma from "../../core/database/prisma.js";

// ! CREATE ACTIVITY RECORD
export const createActivity = async data => {
  return prisma.activity.create({
    data,
  });
};

// ! FIND PROJECT ACTIVITIES
export const findProjectActivities = async ({ projectId, skip, limit }) => {
  return prisma.activity.findMany({
    where: {
      projectId,
    },

    include: {
      actor: {
        select: {
          id: true,
          username: true,
          avatarUrl: true,
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },

    skip,
    take: limit,
  });
};

// ! COUNT PROJECT ACTIVITIES
export const countProjectActivities = async projectId => {
  return prisma.activity.count({
    where: {
      projectId,
    },
  });
};
