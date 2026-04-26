import { ApiError, asyncHandler } from "../utils/index.js";
import { findProjectByIdMinimal } from "../../modules/projects/core/project.repository.js";

// ! MIDDLEWARE TO CHECK IF THE PROJECT IS ACTIVE (NOT ARCHIVED)
const requireActiveProject = asyncHandler(async (req, res, next) => {
  let projectId = req.params.projectId || req.projectId;

  if (!projectId && req.task) {
    // If projectId is not in params, try to get it from the task (for comment routes)
    projectId = req.task?.projectId;
  }

  if (!projectId && req.comment) {
    // If projectId is not in params, try to get it from the comment's task (for comment routes)
    projectId = req.comment.task?.projectId;
  }

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
