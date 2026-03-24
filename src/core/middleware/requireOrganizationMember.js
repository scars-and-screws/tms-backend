import prisma from "../database/prisma.js";
import { ApiError, asyncHandler } from "../utils/index.js";

// ! REQUIRE ORGANIZATION MEMBER MIDDLEWARE
const requireOrganizationMember = asyncHandler(async (req, res, next) => {
  const { organizationId } = req.params;
  const userId = req.user.id;

  const membership = await prisma.organizationMember.findFirst({
    where: {
      organizationId,
      userId,
    },
  });

  if (!membership) {
    throw new ApiError(403, "You do not have access to this organization");
  }
  req.organizationMember = membership;

  next();
});

export default requireOrganizationMember;
