import { ApiError, asyncHandler } from "../utils/index.js";
import { findProjectByIdMinimal } from "../../modules/projects/core/project.repository.js";

// ! MIDDLEWARE TO CHECK IF THE PROJECT IS ACTIVE (NOT ARCHIVED)
const requireActiveProject = asyncHandler(async (req, res, next) => {
  const projectId = req.params.projectId || req.projectId;

  if (!projectId) {
    throw new ApiError(400, "Project ID is required");
  }

  const project = await findProjectByIdMinimal(projectId);

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  if (project.isArchived) {
    throw new ApiError(
      403,
      "This project is archived. Unarchive to perform this action."
    );
  }

  next();
});

export default requireActiveProject;
