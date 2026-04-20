import prisma from "../database/prisma.js";
import { ApiError, asyncHandler } from "../utils/index.js";

// ! MIDDLEWARE TO CHECK IF THE PROJECT IS ACTIVE (NOT ARCHIVED)
const requireActiveProject = asyncHandler(async (req, res, next) => {
  const { projectId } = req.params;
  if (!projectId) {
    throw new ApiError(400, "Project ID is required");
  }

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { isArchived: true },
  });

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
