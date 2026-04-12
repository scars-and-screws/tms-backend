hey before going to the projec  i also have to refactor organization member code i guess i am giving you the organization member codes below help me with tis too 

ROUTES CODE 
import { Router } from "express";
import {
  addOrganizationMemberController,
  addOrganizationMemberSchema,
  listOrganizationMembersController,
  listOrganizationMembersSchema,
  updateOrganizationMemberRoleController,
  updateOrganizationMemberRoleSchema,
  removeOrganizationMemberController,
  removeOrganizationMemberSchema,
} from "./index.js";
import {
  validate,
  requireOrganizationRole,
} from "../../../core/middleware/index.js";

const router = Router({ mergeParams: true });

//  ADD MEMBER TO ORGANIZATION
router.post(
  "/",
  requireOrganizationRole(["OWNER", "ADMIN"]),
  validate(addOrganizationMemberSchema),
  addOrganizationMemberController
);

//  LIST ORGANIZATION MEMBERS
router.get(
  "/",
  validate(listOrganizationMembersSchema),
  listOrganizationMembersController
);

//  UPDATE ORGANIZATION MEMBER ROLE
router.patch(
  "/:organizationMemberId",
  requireOrganizationRole(["OWNER", "ADMIN"]),
  validate(updateOrganizationMemberRoleSchema),
  updateOrganizationMemberRoleController
);

// REMOVE ORGANIZATION MEMBER
router.delete(
  "/:organizationMemberId",
  requireOrganizationRole(["OWNER", "ADMIN"]),
  validate(removeOrganizationMemberSchema),
  removeOrganizationMemberController
);

export default router;


CONTROLLER CODE 
import { asyncHandler, ApiResponse } from "../../../core/utils/index.js";
import {
  addOrganizationMemberService,
  listOrganizationMembersService,
  updateOrganizationMemberRoleService,
  removeOrganizationMemberService,
} from "./index.js";

// ! ADD ORGANIZATION MEMBER CONTROLLER
export const addOrganizationMemberController = asyncHandler(
  async (req, res) => {
    const { organizationId } = req.params;
    const { email, role } = req.body;
    const actorId = req.user.id;

    const member = await addOrganizationMemberService({
      organizationId,
      email,
      role,
      actorId,
    });

    return res
      .status(201)
      .json(new ApiResponse(201, member, "Member added successfully"));
  }
);

// ! LIST ORGANIZATION MEMBERS CONTROLLER
export const listOrganizationMembersController = asyncHandler(
  async (req, res) => {
    const { organizationId } = req.params;

    const members = await listOrganizationMembersService(organizationId);

    return res
      .status(200)
      .json(new ApiResponse(200, members, "Members retrieved successfully"));
  }
);

// ! UPDATE ORGANIZATION MEMBER ROLE CONTROLLER
export const updateOrganizationMemberRoleController = asyncHandler(
  async (req, res) => {
    const { organizationId, memberId } = req.params;
    const { role } = req.body;
    const actorId = req.user.id;

    const updatedMember = await updateOrganizationMemberRoleService({
      organizationId,
      memberId,
      newRole: role,
      actorId,
    });

    return res
      .status(200)
      .json(
        new ApiResponse(200, updatedMember, "Member role updated successfully")
      );
  }
);

// ! REMOVE ORGANIZATION MEMBER CONTROLLER
export const removeOrganizationMemberController = asyncHandler(
  async (req, res) => {
    const { organizationId, memberId } = req.params;
    const actorId = req.user.id;

    await removeOrganizationMemberService({
      organizationId,
      memberId,
      actorId,
    });

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Member removed successfully"));
  }
);

SERVICE CODE 
import prisma from "../../../core/database/prisma.js";
import { ApiError } from "../../../core/utils/index.js";
import { createActivityService } from "../../../core/activity/activity.service.js";
import { ACTIVITY_TYPES } from "../../../core/constants/index.js";
import { sanitizeOrganizationMember } from "./index.js";

// ! ADD ORGANIZATION MEMBER SERVICE
export const addOrganizationMemberService = async ({
  organizationId,
  email,
  role,
  actorId,
}) => {
  // 1️⃣ Find user by email
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new ApiError(404, "User with this email does not exist");
  }

  // 2️⃣ Check if the user is already a member of the organization
  const existingOrganizationMember = await prisma.organizationMember.findUnique(
    {
      where: {
        userId_organizationId: {
          userId: user.id,
          organizationId,
        },
      },
    }
  );

  if (existingOrganizationMember) {
    throw new ApiError(409, "User is already a member of this organization");
  }

  // 3️⃣ Create membership
  const organizationMember = await prisma.organizationMember.create({
    data: {
      organizationId,
      userId: user.id,
      role,
    },
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

  // 4️⃣ Log activity
  await createActivityService({
    actorId,
    type: ACTIVITY_TYPES.MEMBER_ADDED,
    organizationId,
    metadata: {
      memberId: user.id,
      role,
    },
  });

  return sanitizeOrganizationMember(organizationMember);
};

// ! UPDATE ORGANIZATION MEMBER ROLE SERVICE
export const updateOrganizationMemberRoleService = async ({
  organizationId,
  memberId,
  newRole,
  actorId,
}) => {
  // 1️⃣ Fetch actor membership to check permissions
  const actor = await prisma.organizationMember.findUnique({
    where: {
      userId_organizationId: {
        userId: actorId,
        organizationId,
      },
    },
  });

  // 2️⃣ Fetch target membership
  const target = await prisma.organizationMember.findUnique({
    where: { id: memberId },
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

  if (!target || target.organizationId !== organizationId) {
    throw new ApiError(404, "Member not found in this organization");
  }

  // 3️⃣ Prevent changing own role
  if (target.role === "OWNER") {
    throw new ApiError(403, "Cannot modify organization owner");
  }

  // 4️⃣ ADMIN restrictions
  if (actor.role === "ADMIN") {
    if (target.role !== "MEMBER") {
      throw new ApiError(403, "Admin can only modify members");
    }
  }

  // 5️⃣ Update role
  const updated = await prisma.organizationMember.update({
    where: { id: memberId },
    data: { role: newRole },
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

  // 6️⃣ Log activity
  await createActivityService({
    actorId,
    type: ACTIVITY_TYPES.MEMBER_ROLE_UPDATED,
    organizationId,
    metadata: {
      memberId: target.userId,
      role: newRole,
    },
  });

  return sanitizeOrganizationMember(updated);
};

// ! REMOVE ORGANIZATION MEMBER SERVICE
export const removeOrganizationMemberService = async ({
  organizationId,
  memberId,
  actorId,
}) => {
  // 1️⃣ Fetch actor membership
  const actor = await prisma.organizationMember.findUnique({
    where: {
      userId_organizationId: {
        userId: actorId,
        organizationId,
      },
    },
  });

  // 2️⃣ Fetch target membership
  const target = await prisma.organizationMember.findUnique({
    where: { id: memberId },
  });

  if (!target || target.organizationId !== organizationId) {
    throw new ApiError(404, "Member not found in this organization");
  }

  // 3️⃣ Prevent removing own membership
  if (target.role === "OWNER") {
    throw new ApiError(403, "Cannot remove organization owner");
  }

  // 4️⃣ Prevent owner removing themselves
  if (actorId === target.userId) {
    throw new ApiError(
      403,
      "Owner cannot remove themselves from the organization"
    );
  }

  // 5️⃣ ADMIN restrictions
  if (actor.role === "ADMIN" && target.role !== "MEMBER") {
    throw new ApiError(403, "Admin can only remove members");
  }

  // 6️⃣ Remove membership
  await prisma.organizationMember.delete({
    where: { id: memberId },
  });

  // 7️⃣ Log activity
  await createActivityService({
    actorId,
    type: ACTIVITY_TYPES.MEMBER_REMOVED,
    organizationId,
    metadata: {
      memberId: target.userId,
    },
  });
};

REPOSITOR CODE 
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

HELPER CODE 
export const sanitizeOrganizationMember = membership => {
  return {
    id: membership.id,
    role: membership.role,
    joinedAt: membership.joinedAt,

    user: {
      id: membership.user.id,
      name: membership.user.username,
      email: membership.user.email,
      firstName: membership.user.firstName,
      lastName: membership.user.lastName,
      avatarUrl: membership.user.avatarUrl,
    },
  };
};

export const mapOrganizationMemberList = memberships => {
  return memberships.map(sanitizeOrganizationMember);
};

VALIDATION CODE
import { z } from "zod";
import { emailSchema, idSchema } from "../../../core/validation/index.js";

// ! ADD ORGANIZATION MEMBER VALIDATION SCHEMA
export const addOrganizationMemberSchema = {
  params: z.object({
    organizationId: idSchema,
  }),

  body: z
    .object({
      email: emailSchema,
      role: z.enum(["ADMIN", "MEMBER"]).default("MEMBER"),
    })
    .strict(),
};

// ! LIST ORGANIZATION MEMBERS VALIDATION SCHEMA
export const listOrganizationMembersSchema = {
  params: z.object({
    organizationId: idSchema,
  }),
};

// ! UPDATE ORGANIZATION MEMBER ROLE VALIDATION SCHEMA
export const updateOrganizationMemberRoleSchema = {
  params: z.object({
    organizationId: idSchema,
    memberId: idSchema,
  }),

  body: z
    .object({
      role: z.enum(["ADMIN", "MEMBER"]),
    })
    .strict(),
};

// ! REMOVE ORGANIZATION MEMBER VALIDATION SCHEMA
export const removeOrganizationMemberSchema = {
  params: z.object({
    organizationId: idSchema,
    memberId: idSchema,
  }),
};
