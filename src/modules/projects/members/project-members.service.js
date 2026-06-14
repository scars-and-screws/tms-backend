import { ApiError } from "../../../shared/errors/api-error.js";
import { findProjectById } from "../project/project.repository.js";
import { findOrganizationMember } from "../../organizations/organization/organization.repository.js";
import {
  getPagination,
  buildPaginationMeta,
} from "../../../shared/pagination/pagination.utils.js";

import {
  createActivityService,
  ACTIVITY_TYPES,
  buildChanges,
} from "../../activity/activity/index.js";
import {
  createProjectMember,
  findProjectMember,
  findProjectMemberById,
  findProjectMembers,
  countProjectMembers,
  updateProjectMemberRoleById,
  deleteProjectMemberById,
  countProjectAdmins,
  searchProjectMembers,
} from "./project-members.repository.js";

// ! ADD PROJECT MEMBER SERVICE
export const addProjectMemberService = async (
  projectId,
  userId,
  role,
  actorId
) => {
  // 1️⃣ Check if project exists
  const project = await findProjectById(projectId);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  // 2️⃣ Check user is part of the organization
  const orgMember = await findOrganizationMember(
    userId,
    project.organizationId
  );
  if (!orgMember) {
    throw new ApiError(
      400,
      "User must be part of the organization before joining the project"
    );
  }

  // 3️⃣ Check if user is already a member of the project
  const existing = await findProjectMember(userId, projectId);
  if (existing) {
    throw new ApiError(409, "User already a project member");
  }

  // 4️⃣ Role restriction so only project admin can add other project admins
  if (role === "ADMIN") {
    const actorMembership = await findProjectMember(actorId, projectId);
    if (!actorMembership || actorMembership.role !== "ADMIN") {
      throw new ApiError(
        403,
        "Only project admins can assign ADMIN role to other members"
      );
    }
  }

  // 5️⃣ Create project membership
  const member = await createProjectMember({
    projectId,
    userId,
    role,
  });

  // 6️⃣ Log activity (non-blocking)
  // 6️⃣ Log activity
  await createActivityService({
    actorId,

    type: ACTIVITY_TYPES.PROJECT_MEMBER_ADDED,

    organizationId: project.organizationId,

    projectId,

    entity: {
      id: userId,

      type: "USER",

      title: member.user?.username,
    },

    extra: {
      role,
    },
  });

  return member;
};

// ! LIST PROJECT MEMBERS SERVICE
export const listProjectMembersService = async (projectId, query) => {
  // 1️⃣ Normalize
  const pagination = getPagination(query);

  // 2️⃣ Query
  const [members, total] = await Promise.all([
    findProjectMembers({
      projectId,

      skip: pagination.skip,

      limit: pagination.limit,
    }),

    countProjectMembers(projectId),
  ]);

  // 3️⃣ Return
  return {
    members,

    pagination: buildPaginationMeta({
      total,

      page: pagination.page,

      limit: pagination.limit,
    }),
  };
};

// ! SEARCH PROJECT MEMBERS SERVICE (FOR MENTIONS)
export const searchProjectMembersService = async (projectId, query) => {
  const members = await searchProjectMembers(projectId, query);

  // flatten user data for frontend
  return members.map(m => m.user); // return array of users instead of memberships
};

// ! UPDATE PROJECT MEMBER ROLE SERVICE
export const updateProjectMemberRoleService = async (
  memberId,
  newRole,
  actorId
) => {
  // 1️⃣ Fetch membership
  const member = await findProjectMemberById(memberId);
  if (!member) {
    throw new ApiError(404, "Project member not found");
  }

  // 2️⃣ Prevent self role change
  if (member.userId === actorId) {
    throw new ApiError(403, "You cannot change your own role");
  }

  // 3️⃣ Prevent redundant role update
  if (member.role === newRole) {
    throw new ApiError(400, "Role is already set ");
  }

  // 4️⃣ Prevent orphan project
  if (member.role === "ADMIN" && newRole !== "ADMIN") {
    const adminCount = await countProjectAdmins(member.projectId);

    if (adminCount <= 1) {
      throw new ApiError(400, "Project must have at least one admin");
    }
  }

  const updated = await updateProjectMemberRoleById(memberId, newRole);

  // 5️⃣ Log activity (non-blocking)
  await createActivityService({
    actorId,

    type: ACTIVITY_TYPES.PROJECT_MEMBER_ROLE_UPDATED,

    organizationId: member.project.organizationId,

    projectId: member.projectId,

    entity: {
      id: member.userId,

      type: "USER",

      title: member.user?.username,
    },

    changes: buildChanges(
      {
        role: member.role,
      },

      {
        role: newRole,
      }
    ),
  });

  return updated;
};

// ! REMOVE PROJECT MEMBER SERVICE
export const removeProjectMemberService = async (memberId, actorId) => {
  // 1️⃣ Fetch membership
  const member = await findProjectMemberById(memberId);
  if (!member) {
    throw new ApiError(404, "Project member not found");
  }

  // 2️⃣ Prevent self removal
  if (member.userId === actorId) {
    throw new ApiError(403, "You cannot remove yourself from the project");
  }

  // 3️⃣ Remove project membership
  await deleteProjectMemberById(memberId);

  // 4️⃣ Log activity (non-blocking)
  await createActivityService({
    actorId,

    type: ACTIVITY_TYPES.PROJECT_MEMBER_REMOVED,

    organizationId: member.project.organizationId,

    projectId: member.projectId,

    entity: {
      id: member.userId,

      type: "USER",

      title: member.user?.username,
    },

    extra: {
      role: member.role,
    },
  });
};

// ! LEAVE PROJECT SERVICE (SELF-REMOVAL)
export const leaveProjectService = async (projectId, userId) => {
  // 1️⃣ Fetch check project exists
  const project = await findProjectById(projectId);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  // 2️⃣ Fetch membership
  const member = await findProjectMember(userId, projectId);
  if (!member) {
    throw new ApiError(403, "You are not a member of this project");
  }

  // 3️⃣ ADMIN CHECK: Prevent leaving if user is the last admin
  if (member.role === "ADMIN") {
    const adminCount = await countProjectAdmins(projectId);
    if (adminCount <= 1) {
      throw new ApiError(
        400,
        "You are last admin. Assign another admin before leaving the project"
      );
    }
  }

  // 4️⃣ Remove project membership
  await deleteProjectMemberById(member.id);

  // 5️⃣ Log activity (non-blocking)
  await createActivityService({
    actorId: userId,

    type: ACTIVITY_TYPES.PROJECT_MEMBER_LEFT,

    organizationId: project.organizationId,

    projectId,

    entity: {
      id: userId,

      type: "USER",

      title: member.user?.username,
    },

    extra: {
      role: member.role,
    },
  });

  return true;
};
