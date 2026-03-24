import prisma from "../../core/database/prisma.js";
import { ApiError } from "../../core/utils/index.js";
import { mapOrganizationList, sanitizeOrganization } from "./index.js";

// ! LIST USER ORGANIZATIONS QUERY SERVICE
export const listUserOrganizationsQueryService = async userId => {
  const memberships = await prisma.organizationMember.findMany({
    where: {
      userId,
    },
    include: {
      organization: true,
    },
    orderBy: {
      joinedAt: "asc",
    },
  });
  return mapOrganizationList(memberships);
};

// ! GET ORGANIZATION QUERY SERVICE
export const getOrganizationQueryService = async organizationId => {
  const organization = await prisma.organization.findUnique({
    where: {
      id: organizationId,
    },
  });
  if (!organization) {
    throw new ApiError(404, "Organization not found");
  }
  return sanitizeOrganization(organization);
};
