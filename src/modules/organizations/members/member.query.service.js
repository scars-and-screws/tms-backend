import prisma from "../../../core/database/prisma.js";
import { mapMemberList } from "./index.js";

// ! LIST MEMBERS QUERY SERVICE
export const listMembersQueryService = async organizationId => {
  const memberships = await prisma.organizationMember.findMany({
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
  return mapMemberList(memberships);
};
