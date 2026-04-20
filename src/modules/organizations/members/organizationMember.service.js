import {
  createOrganizationMember,
  findOrganizationMemberById,
  updateOrganizationMemberRoleById,
  findUserByEmail,
  findOrganizationMembers,
} from "./organizationMember.repository.js";
import {
  deleteOrganizationMemberById,
  findOrganizationMember,
} from "../core/index.js";
import { ApiError } from "../../../core/utils/index.js";
import { createActivityService } from "../../../core/activity/activity.service.js";
import {
  mapOrganizationMemberList,
  sanitizeOrganizationMember,
} from "./index.js";
import { ACTIVITY_TYPES } from "../../../core/constants/index.js";

// ! ADD ORGANIZATION MEMBER SERVICE
export const addOrganizationMemberService = async ({
  organizationId,
  email,
  role,
  actorId,
}) => {
  // 1️⃣ Find user by email
  const user = await findUserByEmail(email);

  if (!user) {
    throw new ApiError(404, "User not found ");
  }

  // 2️⃣ Check membership
  const existing = await findOrganizationMember(user.id, organizationId);

  if (existing) {
    throw new ApiError(409, "User is already a member of this organization");
  }

  // 3️⃣ Create membership
  const member = await createOrganizationMember({
    organizationId,
    userId: user.id,
    role,
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

  return sanitizeOrganizationMember(member);
};

// ! LIST ORGANIZATION MEMBERS SERVICE
export const listOrganizationMembersService = async organizationId => {
  const members = await findOrganizationMembers(organizationId);
  return mapOrganizationMemberList(members);
};

// ! UPDATE ORGANIZATION MEMBER ROLE SERVICE
export const updateOrganizationMemberRoleService = async (
  organizationId,
  memberId,
  newRole,
  actorId
) => {
  // 1️⃣ Fetch actor membership to check permissions
  const actor = await findOrganizationMember(actorId, organizationId);

  if (!actor) {
    throw new ApiError(403, "You do not have access to this organization");
  }

  // 2️⃣ Fetch target membership
  const target = await findOrganizationMemberById(memberId);

  if (!target || target.organizationId !== organizationId) {
    throw new ApiError(404, "Member not found in this organization");
  }

  // 3️⃣ Prevent changing own role
  if (target.role === "OWNER") {
    throw new ApiError(403, "Cannot modify organization owner");
  }

  // 4️⃣ ADMIN restrictions
  if (actor.role === "ADMIN" && target.role !== "MEMBER") {
    throw new ApiError(403, "Admin can only modify member roles");
  }

  // 5️⃣ Update role
  const updated = await updateOrganizationMemberRoleById(memberId, newRole);

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
  const actor = await findOrganizationMember(actorId, organizationId);

  if (!actor) {
    throw new ApiError(403, "You do not have access to this organization");
  }

  // 2️⃣ Fetch target membership
  const target = await findOrganizationMemberById(memberId);

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
  await deleteOrganizationMemberById(target.id);

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
