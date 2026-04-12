import prisma from "../../../core/database/prisma.js";

// ! ADD MEMBER TO PROJECT
export const createProjectMember = async data => {
  return prisma.projectMember.create({
    data,
  });
};

// ! FIND MEMBER (IMPORTANT FOR RBAC)
export const findProjectMember = async (projectId, userId) => {
  return prisma.projectMember.findUnique({
    where: {
      userId_projectId: {
        userId,
        projectId,
      },
    },
  });
};

// ! GET ALL MEMBERS
export const findProjectMembers = async projectId => {
  return prisma.projectMember.findMany({
    where: { projectId },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          email: true,
          avatarUrl: true,
        },
      },
    },
  });
};

// ! UPDATE MEMBER ROLE
export const updateProjectMemberRole = async (projectId, userId, role) => {
  return prisma.projectMember.update({
    where: {
      userId_projectId: {
        userId,
        projectId,
      },
    },
    data: { role },
  });
};

// ! REMOVE MEMBER
export const deleteProjectMember = async (projectId, userId) => {
  return prisma.projectMember.delete({
    where: {
      userId_projectId: {
        userId,
        projectId,
      },
    },
  });
};
