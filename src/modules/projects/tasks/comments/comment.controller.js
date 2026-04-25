import { asyncHandler, ApiResponse } from "../../../../core/utils/index.js";
import {
  createCommentService,
  listCommentsService,
  updateCommentService,
  deleteCommentService,
} from "./comment.service.js";

// ! CREATE COMMENT CONTROLLER
export const createCommentController = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const userId = req.user.id;
  const { content } = req.body;

  const comment = await createCommentService(taskId, userId, content);

  return res
    .status(201)
    .json(new ApiResponse(201, comment, "Comment created successfully"));
});

// ! LIST COMMENTS CONTROLLER
export const listCommentsController = asyncHandler(async (req, res) => {
  const { taskId } = req.params;

  const comments = await listCommentsService(taskId);

  return res
    .status(200)
    .json(new ApiResponse(200, comments, "Comments retrieved successfully"));
});

// ! UPDATE COMMENT CONTROLLER
export const updateCommentController = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user.id;
  const { content } = req.body;

  const updatedComment = await updateCommentService(commentId, userId, content);

  return res
    .status(200)
    .json(new ApiResponse(200, updatedComment, "Comment updated successfully"));
});

// ! DELETE COMMENT CONTROLLER
export const deleteCommentController = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user.id;

  const role = req.projectMembership?.role; // Get the user's role in the project from the middleware

  await deleteCommentService(commentId, userId, role);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Comment deleted successfully"));
});
