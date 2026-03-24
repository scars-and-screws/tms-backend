import prisma from "../../../core/database/prisma.js";
import { ApiError } from "../../../core/utils/index.js";
import { createActivityService } from "../../../core/activity/activity.service.js";
import { ACTIVITY_TYPES } from "../../../core/constants/index.js";
import { sanitizeMember } from "./index.js";

// ! ADD MEMBER SERVICE
export const addMemberService = async ({
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
  const existingMember = await prisma.organizationMember.findUnique({
    where: {
      userId_organizationId: {
        userId: user.id,
        organizationId,
      },
    },
  });

  if (existingMember) {
    throw new ApiError(409, "User is already a member of this organization");
  }

  // 3️⃣ Create membership
  const membership = await prisma.organizationMember.create({
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

  return sanitizeMember(membership);
};

// ! UPDATE MEMBER ROLE SERVICE
export const updateMemberRoleService = async ({
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

  return sanitizeMember(updated);
};

// ! REMOVE MEMBER SERVICE
export const removeMemberService = async ({
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
