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

// ! FIND TASK ACTIVITIES
export const findTaskActivities = async ({ taskId, skip, limit }) => {
  return prisma.activity.findMany({
    where: {
      taskId,
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

// ! COUNT TASK ACTIVITIES
export const countTaskActivities = async taskId => {
  return prisma.activity.count({
    where: {
      taskId,
    },
  });
};

// ! FIND ORGANIZATION ACTIVITIES
export const findOrganizationActivities = async ({
  organizationId,
  skip,
  limit,
}) => {
  return prisma.activity.findMany({
    where: {
      organizationId,
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

// ! COUNT ORGANIZATION ACTIVITIES
export const countOrganizationActivities = async organizationId => {
  return prisma.activity.count({
    where: {
      organizationId,
    },
  });
};
