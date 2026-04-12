import prisma from "../../../core/database/prisma.js";
import { mapOrganizationMemberList } from "./index.js";

// ! LIST ORGANIZATION MEMBERS SERVICE
export const listOrganizationMembersService = async organizationId => {
  const organizationMembers = await prisma.organizationMember.findMany({
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
  return mapOrganizationMemberList(organizationMembers);
};
