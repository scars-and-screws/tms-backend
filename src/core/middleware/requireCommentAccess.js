import { ApiError, asyncHandler } from "../utils/index.js";
import { findCommentById } from "../../modules/projects/tasks/comments/comment.repository.js";
import { findProjectMember } from "../../modules/projects/members/projectMember.repository.js";

// ! MIDDLEWARE TO CHECK IF USER HAS ACCESS TO A COMMENT
const requireCommentAccess = asyncHandler(async (req, res, next) => {
  const { commentId } = req.params;
  const userId = req.user.id;

  // 1️⃣ Find the comment
  const comment = await findCommentById(commentId);
  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  const projectId = comment.task?.projectId;
  if (!projectId) {
    throw new ApiError(400, "Invalid comment data: missing project context");
  }

  // 2️⃣ Check if the user is a member of the project
  const membership = await findProjectMember(userId, projectId);
  if (!membership) {
    throw new ApiError(403, "You are not a member of this project");
  }

  // 3️⃣ attach for reuse in controllers
  req.comment = comment;
  req.task = comment.task; // for requireActiveTask middleware
  req.projectMembership = membership;

  next();
});

export default requireCommentAccess;
