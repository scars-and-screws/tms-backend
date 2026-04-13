import prisma from "../../../core/database/prisma.js";

const userSelect = {
  id: true,
  username: true,
  email: true,
  firstName: true,
  lastName: true,
  avatarUrl: true,
};

// ! FIND USER BY EMAIL
export const findUserByEmail = async email => {
  return await prisma.user.findUnique({
    where: {
      email,
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
        select: userSelect,
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
        select: userSelect,
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
        select: userSelect,
      },
    },
    orderBy: {
      joinedAt: "asc",
    },
  });
};
