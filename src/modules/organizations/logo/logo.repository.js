import prisma from "../../../core/database/prisma.js";

// ! FIND ORGANIZATION BY ID MINIMAL

export const findOrganizationById = async organizationId => {
  return prisma.organization.findUnique({
    where: { id: organizationId },
    select: { id: true, logoPublicId: true },
  });
};

// ! UPDATE ORGANIZATION LOGO

export const updateOrganizationLogo = async (organizationId, data) => {
  return prisma.organization.update({
    where: { id: organizationId },
    data,
  });
};
