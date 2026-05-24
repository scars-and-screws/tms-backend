import prisma from "../../../../core/database/prisma.js";
// helper to nclude organization id
const taskActivityInclude = {
  project: {
    select: {
      id: true,
      organizationId: true,
    },
  },
};

// ! CREATE TASK
export const createTask = async data => {
  return prisma.task.create({
    data,

    include: taskActivityInclude,
  });
};

// ! FIND TASK BY ID
export const findTaskById = async taskId => {
  return prisma.task.findUnique({
    where: {
      id: taskId,
    },

    include: {
      ...taskActivityInclude,

      assignee: {
        select: {
          id: true,
          username: true,
          avatarUrl: true,
        },
      },
    },
  });
};

// ! FIND TASKS BY ID MINIMAL FOR MIDDLEWARE
export const findTaskByIdMinimal = async taskId => {
  return prisma.task.findUnique({
    where: {
      id: taskId,
    },
    select: {
      id: true,
      projectId: true,
      isArchived: true,
    },
  });
};

// ! LIST TASKS BY PROJECT ID WITH FILTERS
export const findTasksByProjectId = async ({
  projectId,
  status,
  priority,
  assigneeId,
  skip,
  limit,
}) => {
  const where = {
    projectId,
    isArchived: false,
  };

  if (status) where.status = status;

  if (priority) where.priority = priority;

  if (assigneeId) where.assigneeId = assigneeId;

  return prisma.task.findMany({
    where,

    include: {
      assignee: {
        select: {
          id: true,
          username: true,
          avatarUrl: true,
        },
      },
    },

    orderBy: [
      {
        position: "asc",
      },

      {
        createdAt: "desc",
      },
    ],

    skip,

    take: limit,
  });
};

// ! COUNT TASKs
export const countTasksByProject = async ({
  projectId,
  status,
  priority,
  assigneeId,
}) => {
  const where = {
    projectId,
    isArchived: false,
  };

  if (status) where.status = status;

  if (priority) where.priority = priority;

  if (assigneeId) where.assigneeId = assigneeId;

  return prisma.task.count({
    where,
  });
};

// ! UPDATE TASK
export const updateTask = async (taskId, data) => {
  return prisma.task.update({
    where: {
      id: taskId,
    },

    data,

    include: taskActivityInclude,
  });
};

// ! DELETE TASK
export const deleteTask = async taskId => {
  return prisma.task.delete({
    where: {
      id: taskId,
    },
  });
};

// ! ASSIGN TASK
export const assignTask = async (taskId, assigneeId, assignedById) => {
  return prisma.task.update({
    where: {
      id: taskId,
    },

    data: {
      assigneeId,

      assignedById,
    },

    include: taskActivityInclude,
  });
};

// ! UPDATE TASK STATUS
export const updateTaskStatus = async (taskId, status) => {
  return prisma.task.update({
    where: {
      id: taskId,
    },

    data: {
      status,

      completedAt: status === "DONE" ? new Date() : null,
    },

    include: taskActivityInclude,
  });
};

// ! ARCHIVE TASK
export const archiveTask = async taskId => {
  return prisma.task.update({
    where: {
      id: taskId,
    },

    data: {
      isArchived: true,
    },

    include: taskActivityInclude,
  });
};

// ! UNARCHIVE TASK
export const unarchiveTask = async taskId => {
  return prisma.task.update({
    where: {
      id: taskId,
    },

    data: {
      isArchived: false,
    },

    include: taskActivityInclude,
  });
};

// ! FIND TASK NOTIFICATION DATA
export const findTaskNotificationData = async taskId => {
  return prisma.task.findUnique({
    where: {
      id: taskId,
    },
    select: {
      id: true,

      title: true,

      projectId: true,

      createdById: true,

      assigneeId: true,

      assignedById: true,
    },
  });
};
