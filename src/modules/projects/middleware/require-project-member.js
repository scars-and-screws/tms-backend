import { ApiError } from "../../../shared/errors/api-error.js";
import { asyncHandler } from "../../../shared/utils/index.js";
import { findProjectMember } from "../../projects/members/project-members.repository.js";

// ! MIDDLEWARE TO CHECK PROJECT MEMBERSHIP
const requireProjectMember = asyncHandler(async (req, res, next) => {
  const { projectId } = req.params;
  const userId = req.user.id;

  if (!projectId) {
    throw new ApiError(400, "Project ID is required");
  }

  const membership = await findProjectMember(userId, projectId);

  if (!membership) {
    throw new ApiError(403, "You are not a member of this project");
  }

  req.projectMembership = membership; // Attach membership info to the request object
  next();
});

export default requireProjectMember;
