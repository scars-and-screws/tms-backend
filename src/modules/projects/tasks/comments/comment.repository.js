import prisma from "../../../../core/database/prisma.js";

// helper for activity + notification context
const commentActivityInclude = {
  task: {
    select: {
      id: true,

      projectId: true,

      project: {
        select: {
          organizationId: true,
        },
      },
    },
  },
};

// ! CREATE COMMENT
export const createComment = async data => {
  return prisma.taskComment.create({
    data,

    include: commentActivityInclude,
  });
};

// ! FIND COMMENT BY ID (for middleware)
export const findCommentById = async commentId => {
  return prisma.taskComment.findUnique({
    where: {
      id: commentId,
    },
    include: commentActivityInclude,
  });
};

// ! LIST COMMENTS BY TASK ID
export const findCommentsByTaskId = async taskId => {
  return prisma.taskComment.findMany({
    where: {
      taskId: taskId,
    },
    orderBy: {
      createdAt: "asc",
    },

    include: {
      author: {
        select: {
          id: true,
          username: true,
          avatarUrl: true,
        },
      },
      // Include the attachments
      files: {
        select: {
          id: true,
          fileName: true,
          fileUrl: true,
          mimeType: true,
          size: true,
        },
      },
      mentions: {
        include: {
          user: {
            select: {
              id: true,
              username: true,
            },
          },
        },
      },
    },
  });
};

// ! UPDATE COMMENT
export const updateComment = async (commentId, data) => {
  return prisma.taskComment.update({
    where: {
      id: commentId,
    },

    data,

    include: commentActivityInclude,
  });
};

// ! DELETE COMMENT
export const deleteComment = async commentId => {
  return prisma.taskComment.delete({
    where: {
      id: commentId,
    },
  });
};
