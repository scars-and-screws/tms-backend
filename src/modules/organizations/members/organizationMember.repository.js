import prisma from "../../../core/database/prisma.js";
import { mapOrganizationMemberList } from "./index.js";

// ! FIND USER BY EMAIL
export const findUserByEmail = async email => {
  return await prisma.user.findUnique({
    where: {
      email,
    },
  });
};

// ! FIND MEMBERSHIP BY USER ID AND ORGANIZATION ID
export const findOrganizationMember = async (userId, organizationId) => {
  return prisma.organizationMember.findUnique({
    where: {
      userId_organizationId: {
        userId,
        organizationId,
      },
    },
  });
};

// ! FIND MEMBER BY ID
export const findOrganizationMemberById = async memberId => {
  return prisma.organizationMember.findUnique({
    where: { id: memberId },
  });
};

// ! CREATE MEMBER
export const createOrganizationMember = async data => {
  return prisma.organizationMember.create({
    data,
    include: {
      user: {
        select: {
          id: true,
          username: true,
          email: true,
          firstName: true,
          lastName: true,
          avatarUrl: true,
        },
      },
    },
  });
};

// ! UPDATE MEMBER ROLE
export const updateOrganizationMemberRoleById = async (memberId, role) => {
  return prisma.organizationMember.update({
    where: { id: memberId },
    data: { role },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          email: true,
          firstName: true,
          lastName: true,
          avatarUrl: true,
        },
      },
    },
  });
};

// ! DELETE MEMBER
export const deleteOrganizationMemberById = async memberId => {
  return prisma.organizationMember.delete({
    where: { id: memberId },
  });
};

// ! LIST MEMBERS
export const findOrganizationMembers = async organizationId => {
  return prisma.organizationMember.findMany({
    where: { organizationId },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          email: true,
          firstName: true,
          lastName: true,
          avatarUrl: true,
        },
      },
    },
    orderBy: {
      joinedAt: "asc",
    },
  });
};
