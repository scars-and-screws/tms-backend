import { ApiError } from "../../../../core/utils/index.js";
import {
  createComment,
  findCommentById,
  findCommentsByTaskId,
  updateComment,
  deleteComment,
} from "./comment.repository.js";

// ! CREATE COMMENT SERVICE
export const createCommentService = async (taskId, userId, content) => {
  return createComment({
    taskId,
    authorId: userId,
    content,
  });
};

// ! LIST COMMENTS SERVICE
export const listCommentsService = async taskId => {
  return findCommentsByTaskId(taskId);
};

// ! UPDATE COMMENT SERVICE
export const updateCommentService = async (commentId, userId, content) => {
  // 1️⃣ find the comment by ID
  const comment = await findCommentById(commentId);
  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  //2️⃣ Check if the user is the author of the comment
  if (comment.authorId !== userId) {
    throw new ApiError(403, "You can only update your own comments");
  }

  // Update the comment
  return updateComment(commentId, { content });
};

// ! DELETE COMMENT SERVICE
export const deleteCommentService = async (commentId, userId, role) => {
  // 1️⃣ find the comment by ID
  const comment = await findCommentById(commentId);
  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  // 2️⃣ Check if the user is the author of the comment or project admin
  if (comment.authorId !== userId && role !== "ADMIN") {
    throw new ApiError(
      403,
      "You can only delete your own comments or if you are a project admin"
    );
  }

  // 3️⃣ Delete the comment
  await deleteComment(commentId);
  return true;
};
