import {
  createProjectService,
  listProjectsService,
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

  const projects = await listProjectsService(organizationId);

  res
    .status(200)
    .json(new ApiResponse(200, projects, "Projects retrieved successfully"));
});
