import prisma from "../../../../infrastructure/database/prisma.js";

// ! CREATE FILE
export const createFile = data => {
  return prisma.file.create({ data });
};

// ! FIND FILES BY TASK
export const findFilesByTaskId = ({ taskId, skip, limit }) => {
  return prisma.file.findMany({
    where: {
      taskId,
    },

    orderBy: {
      createdAt: "desc",
    },

    skip,

    take: limit,
  });
};

// ! COUNT TASK FILES
export const countTaskFiles = taskId => {
  return prisma.file.count({
    where: {
      taskId,
    },
  });
};

// ! FIND FILE BY ID
export const findFileById = fileId => {
  return prisma.file.findUnique({ where: { id: fileId } });
};

// ! FIND FILE WITH TASK AND PROJECT INFO (for access control middleware)
export const findFileWithTaskProject = fileId => {
  return prisma.file.findUnique({
    where: { id: fileId },
    include: {
      task: {
        select: {
          projectId: true,
        },
      },
    },
  });
};

// ! DELETE FILE
export const deleteFile = fileId => {
  return prisma.file.delete({ where: { id: fileId } });
};

// ! FIND FILES BY COMMENT ID
export const findFilesByCommentId = commentId => {
  return prisma.file.findMany({
    where: { commentId },
    orderBy: { createdAt: "desc" },
  });
};
