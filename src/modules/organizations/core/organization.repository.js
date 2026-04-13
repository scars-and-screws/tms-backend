import prisma from "../../../core/database/prisma.js";

// ! FIND ORGANIZATION BY ID
export const findOrganizationById = async organizationId => {
  return prisma.organization.findUnique({
    where: { id: organizationId },
  });
};

// ! FIND ORGANIZATION BY NAME AND OWNER ID
export const findOrganizationByNameAndOwnerId = async (name, ownerId) => {
  return prisma.organization.findFirst({
    where: {
      name,
      ownerId,
    },
  });
};

// ! CREATE ORGANIZATION
export const createOrganization = async data => {
  return prisma.organization.create({
    data,
  });
};

// ! UPDATE ORGANIZATION
export const updateOrganizationById = async (organizationId, data) => {
  return prisma.organization.update({
    where: { id: organizationId },
    data,
  });
};

// ! DELETE ORGANIZATION
export const deleteOrganizationById = async organizationId => {
  return prisma.organization.delete({
    where: { id: organizationId },
  });
};

// ! CREATE ORGANIZATION MEMBER
export const createOrganizationMember = async data => {
  return prisma.organizationMember.create({
    data,
  });
};

// ! FIND ORGANIZATION MEMBER BY USER ID AND ORGANIZATION ID
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

// ! DELETE ORGANIZATION MEMBER
export const deleteOrganizationMemberById = async id => {
  return prisma.organizationMember.delete({
    where: { id },
  });
};

// ! UPDATE ORGANIZATION MEMBER ROLE
export const updateOrganizationMemberRole = async (id, role) => {
  return prisma.organizationMember.update({
    where: { id },
    data: { role },
  });
};

// ! RETRIVE USER BY ID FOR EMAIL VERIFICATION CHECK
export const findUserById = async userId => {
  return prisma.user.findUnique({
    where: { id: userId },
  });
};

// ! LIST USER ORGANIZATIONS
export const findUserOrganizations = async userId => {
  return prisma.organizationMember.findMany({
    where: { userId },
    include: {
      organization: true,
    },
    orderBy: {
      joinedAt: "asc",
    },
  });
};
