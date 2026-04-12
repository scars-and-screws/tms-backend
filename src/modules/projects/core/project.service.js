import { ApiError } from "../../../core/utils/index.js";
import { createActivityService } from "../../../core/activity/activity.service.js";
import {
  ACTIVITY_TYPES,
  PROJECT_ROLES,
} from "../../../core/constants/index.js";
import { findOrganizationById } from "../../organizations/core/organization.repository.js";
import { findOrganizationMember } from "../../organizations/members/organizationMember.repository.js";
import {
  createProject,
  findProjectByNameAndOrg,
  findProjectsByOrganization,
} from "./project.repository.js";

import { createProjectMember } from "../members/projectMember.repository.js";

// ! CREATE PROJECT SERVICE
export const createProjectService = async ({
  organizationId,
  userId,
  data,
}) => {
  const { name, description } = data;

  // 1️⃣ Check organization exists
  const organization = await findOrganizationById(organizationId);

  if (!organization) {
    throw new ApiError(404, "Organization not found");
  }

  // 2️⃣ Check user is member of org
  const membership = await findOrganizationMember(userId, organizationId);

  if (!membership) {
    throw new ApiError(403, "You are not a member of this organization");
  }

  // 3️⃣ Check permission (ADMIN / OWNER)
  if (!["OWNER", "ADMIN"].includes(membership.role)) {
    throw new ApiError(403, "You do not have permission to create a project");
  }

  // 4️⃣ Check for duplicate project name within the same organization
  const existing = await findProjectByNameAndOrg(name, organizationId);
  if (existing) {
    throw new ApiError(
      409,
      "Project with this name already exists in this organization"
    );
  }

  // 5️⃣ Create project
  const project = await createProject({
    name,
    description,
    organizationId,
    createdById: userId,
  });

  // 6️⃣ Add creator as PROJECT ADMIN
  await createProjectMember({
    projectId: project.id,
    userId,
    role: PROJECT_ROLES.ADMIN,
  });

  // 7️⃣ Log activity (non-blocking)
  await createActivityService({
    actorId: userId,
    type: ACTIVITY_TYPES.PROJECT_CREATED,
    organizationId,
    projectId: project.id,
    metadata: {
      projectName: name,
    },
  });

  // 8️⃣ Return clean response
  return {
    id: project.id,
    name: project.name,
    description: project.description,
    organizationId: project.organizationId,
    createdAt: project.createdAt,
  };
};

// ! LIST PROJECTS SERVICE
export const listProjectsService = async organizationId => {
  const projects = await findProjectsByOrganization(organizationId);

  return projects.map(project => ({
    id: project.id,
    name: project.name,
    description: project.description,
    createdAt: project.createdAt,
  }));
};
