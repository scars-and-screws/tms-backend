import {
  createProjectService,
  deleteProjectService,
  getProjectService,
  listProjectsService,
  updateProjectService,
  archiveProjectService,
  unarchiveProjectService,
} from "./project.service.js";
import { asyncHandler, ApiResponse } from "../../../core/utils/index.js";

// ! CREATE PROJECT CONTROLLER
export const createProjectController = asyncHandler(async (req, res) => {
  const { organizationId } = req.params;
  const userId = req.user.id;
  const data = req.body;

  const project = await createProjectService({
    organizationId,
    userId,
    data,
  });
  res
    .status(201)
    .json(new ApiResponse(201, project, "Project created successfully"));
});

// ! LIST PROJECTS CONTROLLER
export const listProjectsController = asyncHandler(async (req, res) => {
  const { organizationId } = req.params;

  const { includeArchived, onlyArchived } = req.query;

  const projects = await listProjectsService({
    organizationId,
    inclueArchived: includeArchived === "true",
    onlyArchived: onlyArchived === "true",
  });

  res
    .status(200)
    .json(new ApiResponse(200, projects, "Projects retrieved successfully"));
});

// ! GET PROJECT CONTROLLER
export const getProjectController = asyncHandler(async (req, res) => {
  const { projectId, organizationId } = req.params;

  const project = await getProjectService(projectId, organizationId);
  return res
    .status(200)
    .json(new ApiResponse(200, project, "Project retrieved successfully"));
});

// ! UPDATE PROJECT CONTROLLER
export const updateProjectController = asyncHandler(async (req, res) => {
  const { projectId, organizationId } = req.params;
  const userId = req.user.id;
  const data = req.body;

  const project = await updateProjectService(
    projectId,
    organizationId,
    userId,
    data
  );
  return res
    .status(200)
    .json(new ApiResponse(200, project, "Project updated successfully"));
});

// ! ARCHIVE PROJECT CONTROLLER
export const archiveProjectController = asyncHandler(async (req, res) => {
  const { projectId, organizationId } = req.params;
  const userId = req.user.id;

  await archiveProjectService(projectId, organizationId, userId);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Project archived successfully"));
});

// ! UNARCHIVE PROJECT CONTROLLER
export const unarchiveProjectController = asyncHandler(async (req, res) => {
  const { projectId, organizationId } = req.params;
  const userId = req.user.id;

  await unarchiveProjectService(projectId, organizationId, userId);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Project unarchived successfully"));
});

// ! DELETE PROJECT CONTROLLER
export const deleteProjectController = asyncHandler(async (req, res) => {
  const { projectId, organizationId } = req.params;
  const userId = req.user.id;
  const { projectName } = req.body;

  await deleteProjectService(projectId, organizationId, userId, projectName);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Project deleted successfully"));
});
