import { ApiError } from "../../../core/utils/index.js";
import {
  createActivityService,
  ACTIVITY_TYPES,
  buildChanges,
  buildProjectEntity,
} from "../../../core/activity/index.js";

import { PROJECT_ROLES } from "./project.constants.js";

import { sanitizeProject, sanitizeProjectList } from "./project.helper.js";

import {
  getPagination,
  buildPaginationMeta,
} from "../../../core/pagination/pagination.utils.js";

import {
  findOrganizationById,
  findOrganizationMember,
} from "../../organizations/core/organization.repository.js";

import {
  createProject,
  findProjectByNameAndOrg,
  countProjectsByOrganization,
  findProjectsByOrganization,
  findProjectById,
  deleteProjectById,
  updateProjectById,
  setProjectArchiveStatus,
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

    entity: buildProjectEntity(project),

    extra: {
      description,
    },
  });

  // 8️⃣ Return clean response
  return sanitizeProject(project);
};

// ! LIST PROJECTS SERVICE
export const listProjectsService = async ({
  organizationId,
  includeArchived,
  onlyArchived,
  query,
}) => {
  // 1️⃣ Normalize
  const pagination = getPagination(query);

  // 2️⃣ Fetch
  const [projects, total] = await Promise.all([
    findProjectsByOrganization({
      organizationId,
      includeArchived,
      onlyArchived,
      skip: pagination.skip,
      limit: pagination.limit,
    }),

    countProjectsByOrganization({
      organizationId,
      includeArchived,
      onlyArchived,
    }),
  ]);

  // 3️⃣ Return
  return {
    projects: sanitizeProjectList(projects),

    pagination: buildPaginationMeta({
      total,
      page: pagination.page,
      limit: pagination.limit,
    }),
  };
};

// ! GET PROJECT SERVICE
export const getProjectService = async (projectId, organizationId) => {
  const project = await findProjectById(projectId);

  if (!project || project.organizationId !== organizationId) {
    throw new ApiError(404, "Project not found");
  }
  return sanitizeProject(project);
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

  const changes = buildChanges(project, updated);

  // Log activity (non-blocking)
  await createActivityService({
    actorId: userId,

    type: ACTIVITY_TYPES.PROJECT_UPDATED,

    organizationId,

    projectId,

    entity: buildProjectEntity(project),

    changes,
  });

  return sanitizeProject(updated);
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

    entity: buildProjectEntity(project),

    changes: buildChanges(
      {
        isArchived: false,
      },

      {
        isArchived: true,
      }
    ),
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

    entity: buildProjectEntity(project),

    changes: buildChanges(
      {
        isArchived: true,
      },

      {
        isArchived: false,
      }
    ),
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

    entity: buildProjectEntity(project),
  });

  return true;
};
