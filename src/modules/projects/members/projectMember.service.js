import { ApiError } from "../../../core/utils/index.js";
import { findProjectById } from "../core/index.js";
import { findOrganizationMember } from "../../organizations/core/index.js";
import { createActivityService } from "../../../core/activity/activity.service.js";
import { ACTIVITY_TYPES } from "../../../core/constants/index.js";
import {
  createProjectMember,
  findProjectMember,
  findProjectMemberById,
  findProjectMembers,
  updateProjectMemberRoleById,
  deleteProjectMemberById,
  countProjectAdmins,
} from "./projectMember.repository.js";

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
  await createActivityService({
    projectId,
    userId: actorId,
    type: ACTIVITY_TYPES.PROJECT_MEMBER_ADDED,
    organizationId: project.organizationId,
    projectId,
    metadata: {
      memberId: userId,
      role,
    },
  });

  return member;
};

// ! LIST PROJECT MEMBERS SERVICE
export const listProjectMembersService = async projectId => {
  return await findProjectMembers(projectId);
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

  const updated = await updateProjectMemberRoleById(memberId, newRole);

  // 4️⃣ Log activity (non-blocking)
  await createActivityService({
    actorId,
    type: ACTIVITY_TYPES.PROJECT_MEMBER_ROLE_UPDATED,
    projectId: member.projectId,
    metadata: {
      memberId: member.userId,
      newRole,
    },
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
    projectId: member.projectId,
    metadata: {
      memberId: member.userId,
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
    projectId,
    metadata: {
      memberId: member.userId,
    },
  });

  return true;
};
