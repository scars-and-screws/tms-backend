import prisma from "../../../core/database/prisma.js";

// 🔹 Reusable user select to prevent sensitive data leak
const userSelect = {
  id: true,
  username: true,
  email: true,
  avatarUrl: true,
};

// ! CREATE PROJECT MEMBER
export const createProjectMember = async data => {
  return prisma.projectMember.create({
    data,
    include: {
      user: {
        select: userSelect,
      },
    },
  });
};

// ! FIND PROJECT MEMBER (BY USER + PROJECT) → used for RBAC & duplicate check
export const findProjectMember = async (userId, projectId) => {
  return prisma.projectMember.findUnique({
    where: {
      userId_projectId: {
        userId,
        projectId,
      },
    },
  });
};

// ! FIND PROJECT MEMBER BY ID → used in update/remove flows
export const findProjectMemberById = async memberId => {
  return prisma.projectMember.findUnique({
    where: { id: memberId },
  });
};

// ! GET ALL PROJECT MEMBERS
export const findProjectMembers = async projectId => {
  return prisma.projectMember.findMany({
    where: { projectId },
    include: {
      user: {
        select: userSelect,
      },
    },
    orderBy: {
      joinedAt: "asc",
    },
  });
};

// ! SEARCH PROJECT MEMBERS (FOR MENTIONS)
export const searchProjectMembers = async (projectId, query) => {
  return prisma.projectMember.findMany({
    where: {
      projectId,
      user: {
        username: {
          contains: query || "",
          mode: "insensitive",
        },
      },
    },
    select: {
      user: {
        select: {
          id: true,
          username: true,
          avatarUrl: true,
        },
      },
    },
    take: 5, //  limit results for better performance
  });
};

// ! UPDATE MEMBER ROLE
export const updateProjectMemberRoleById = async (memberId, role) => {
  return prisma.projectMember.update({
    where: { id: memberId },
    data: { role },
    include: {
      user: {
        select: userSelect,
      },
    },
  });
};

// ! REMOVE PROJECT MEMBER
export const deleteProjectMemberById = async memberId => {
  return prisma.projectMember.delete({
    where: { id: memberId },
  });
};

// ! COUNT ADMINS IN A PROJECT (used to prevent orphaned projects)
export const countProjectAdmins = async projectId => {
  return prisma.projectMember.count({
    where: {
      projectId,
      role: "ADMIN",
    },
  });
};

// ! GET PROJECT ADMINS (for notification purposes)
export const getProjectAdmins = async projectId => {
  return prisma.projectMember.findMany({
    where: {
      projectId,
      role: "ADMIN",
    },
    include: {
      user: {
        select: userSelect,
      },
    },
  });
};
