import Prisma from "../../../../core/database/prisma.js";

// ! CREATE TASK
export const createTask = async data => {
  return Prisma.task.create({
    data,
  });
};

// ! FIND TASK BY ID
export const findTaskById = async taskId => {
  return Prisma.task.findUnique({
    where: {
      id: taskId,
    },

    include: {
      project: {
        select: {
          id: true,
          organizationId: true,
        },
      },
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
  return Prisma.task.findUnique({
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
}) => {
  const where = {
    projectId,
    isArchived: false,
  };

  if (status) where.status = status;
  if (priority) where.priority = priority;
  if (assigneeId) where.assigneeId = assigneeId;

  return Prisma.task.findMany({
    where,
    orderBy: {
      position: "asc",
    },
  });
};

// ! UPDATE TASK
export const updateTask = async (taskId, data) => {
  return Prisma.task.update({
    where: {
      id: taskId,
    },
    data,
  });
};

// ! DELETE TASK
export const deleteTask = async taskId => {
  return Prisma.task.delete({
    where: {
      id: taskId,
    },
  });
};

// ! ASSIGN TASK
export const assignTask = async (taskId, assigneeId) => {
  return Prisma.task.update({
    where: {
      id: taskId,
    },
    data: {
      assigneeId,
    },
  });
};

// ! UPDATE TASK STATUS
export const updateTaskStatus = async (taskId, status) => {
  return Prisma.task.update({
    where: {
      id: taskId,
    },
    data: {
      status,
      completedAt: status === "DONE" ? new Date() : null,
    },
  });
};

// ! ARCHIVE TASK
export const archiveTask = async taskId => {
  return Prisma.task.update({
    where: {
      id: taskId,
    },
    data: {
      isArchived: true,
    },
  });
};

// ! UNARCHIVE TASK
export const unarchiveTask = async taskId => {
  return Prisma.task.update({
    where: {
      id: taskId,
    },
    data: {
      isArchived: false,
    },
  });
};
