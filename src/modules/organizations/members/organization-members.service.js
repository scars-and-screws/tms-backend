import {
  createOrganizationMember,
  findOrganizationMemberById,
  updateOrganizationMemberRoleById,
  findUserByEmail,
  findOrganizationMembers,
  countOrganizationMembers,
} from "./organization-members.repository.js";

import {
  deleteOrganizationMemberById,
  findOrganizationMember,
} from "../organization/organization.repository.js";

import { ApiError } from "../../../shared/errors/api-error.js";
import {
  createActivityService,
  ACTIVITY_TYPES,
  buildChanges,
} from "../../activity/activity/index.js";

import {
  getPagination,
  buildPaginationMeta,
} from "../../../shared/pagination/pagination.utils.js";

import {
  mapOrganizationMemberList,
  sanitizeOrganizationMember,
} from "./organization-members.helper.js";

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

    type: ACTIVITY_TYPES.ORGANIZATION_MEMBER_ADDED,

    organizationId,

    entity: {
      id: user.id,

      type: "USER",

      title: user.username,
    },

    extra: {
      role,
    },
  });

  return sanitizeOrganizationMember(member);
};

// ! LIST ORGANIZATION MEMBERS SERVICE
export const listOrganizationMembersService = async (organizationId, query) => {
  // 1️⃣ Normalize
  const pagination = getPagination(query);

  // 2️⃣ Query
  const [members, total] = await Promise.all([
    findOrganizationMembers({
      organizationId,
      skip: pagination.skip,
      limit: pagination.limit,
    }),

    countOrganizationMembers(organizationId),
  ]);

  // 3️⃣ Return
  return {
    members: mapOrganizationMemberList(members),

    pagination: buildPaginationMeta({
      total,
      page: pagination.page,
      limit: pagination.limit,
    }),
  };
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

  // 5️⃣ Prevent redundent db call
  if (target.role === newRole) {
    throw new ApiError(400, "Member already has this role");
  }

  // 6️⃣ Update role
  const updated = await updateOrganizationMemberRoleById(memberId, newRole);

  // 7️⃣ Log activity
  await createActivityService({
    actorId,

    type: ACTIVITY_TYPES.ORGANIZATION_MEMBER_ROLE_UPDATED,

    organizationId,

    entity: {
      id: target.userId,

      type: "USER",
    },

    changes: buildChanges(
      {
        role: target.role,
      },

      {
        role: newRole,
      }
    ),
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

    type: ACTIVITY_TYPES.ORGANIZATION_MEMBER_REMOVED,

    organizationId,

    entity: {
      id: target.userId,

      type: "USER",
    },

    extra: {
      role: target.role,
    },
  });
};
