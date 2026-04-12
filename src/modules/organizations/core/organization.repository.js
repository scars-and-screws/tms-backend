import prisma from "../../../core/database/prisma.js";

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
