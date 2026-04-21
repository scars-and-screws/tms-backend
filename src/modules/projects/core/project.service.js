import { ApiError } from "../../../core/utils/index.js";
import { createActivityService } from "../../../core/activity/activity.service.js";
import {
  ACTIVITY_TYPES,
  PROJECT_ROLES,
} from "../../../core/constants/index.js";
import {
  findOrganizationById,
  findOrganizationMember,
} from "../../organizations/core/index.js";
import {
  createProject,
  findProjectByNameAndOrg,
  findProjectsByOrganization,
  findProjectById,
  deleteProjectById,
  updateProjectById,
  setProjectArchiveStatus,
} from "./index.js";

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
export const listProjectsService = async ({
  organizationId,
  includeArchived,
  onlyArchived,
}) => {
  const projects = await findProjectsByOrganization({
    organizationId,
    includeArchived,
    onlyArchived,
  });

  return projects.map(project => ({
    id: project.id,
    name: project.name,
    description: project.description,
    isArchived: project.isArchived,
    organizationId: project.organizationId,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
  }));
};

// ! GET PROJECT SERVICE
export const getProjectService = async (projectId, organizaitonId) => {
  const project = await findProjectById(projectId);

  if (!project || project.organizationId !== organizaitonId) {
    throw new ApiError(404, "Project not found");
  }
  return {
    id: project.id,
    name: project.name,
    description: project.description,
    isArchived: project.isArchived,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
    organizationId: project.organizationId,
  };
};

// ! UPDATE PROJECT SERVICE
export const updateProjectService = async (
  projectId,
  organizationId,
  userId,
  data
) => {
  const project = await findProjectById(projectId);

  if (!project || project.organizationId !== organizationId) {
    throw new ApiError(404, "Project not found");
  }

  // Unique name check (if name is being updated)
  if (data.name) {
    const existing = await findProjectByNameAndOrg(data.name, organizationId);
    if (existing && existing.id !== projectId) {
      throw new ApiError(
        409,
        "Project with this name already exists in this organization"
      );
    }
  }

  // Update the project
  const updated = await updateProjectById(projectId, data);

  // Log activity (non-blocking)
  await createActivityService({
    actorId: userId,
    type: ACTIVITY_TYPES.PROJECT_UPDATED,
    organizationId,
    projectId,
    metadata: {
      updatedFields: Object.keys(data),
    },
  });

  return {
    id: updated.id,
    name: updated.name,
    description: updated.description,
    isArchived: updated.isArchived,
    createdAt: updated.createdAt,
  };
};

// ! ARCHIVE PROJECT SERVICE
export const archiveProjectService = async (
  projectId,
  organizationId,
  userId
) => {
  const project = await findProjectById(projectId);

  if (!project || project.organizationId !== organizationId) {
    throw new ApiError(404, "Project not found");
  }
  if (project.isArchived) {
    throw new ApiError(400, "Project  already archived");
  }

  const updated = await setProjectArchiveStatus(projectId, true);

  // Log activity (non-blocking)
  await createActivityService({
    actorId: userId,
    type: ACTIVITY_TYPES.PROJECT_ARCHIVED,
    organizationId,
    projectId,
    metadata: {
      projectName: project.name,
    },
  });

  return updated;
};

// ! UNARCHIVE PROJECT SERVICE
export const unarchiveProjectService = async (
  projectId,
  organizationId,
  userId
) => {
  const project = await findProjectById(projectId);

  if (!project || project.organizationId !== organizationId) {
    throw new ApiError(404, "Project not found");
  }

  if (!project.isArchived) {
    throw new ApiError(400, "Project is not archived");
  }

  const updated = await setProjectArchiveStatus(projectId, false);

  // Log activity (non-blocking)
  await createActivityService({
    actorId: userId,
    type: ACTIVITY_TYPES.PROJECT_UNARCHIVED,
    organizationId,
    projectId,
    metadata: {
      projectName: project.name,
    },
  });

  return updated;
};

// ! DELETE PROJECT SERVICE
export const deleteProjectService = async (
  projectId,
  organizationId,
  userId,
  projectName
) => {
  const project = await findProjectById(projectId);

  if (!project || project.organizationId !== organizationId) {
    throw new ApiError(404, "Project not found");
  }
  // Name confirmation check
  if (project.name !== projectName) {
    throw new ApiError(400, "Project name confirmation does not match");
  }

  await deleteProjectById(projectId);

  // Log activity (non-blocking)
  await createActivityService({
    actorId: userId,
    type: ACTIVITY_TYPES.PROJECT_DELETED,
    organizationId,
    projectId,
    metadata: {
      projectName: project.name,
    },
  });

  return true;
};
