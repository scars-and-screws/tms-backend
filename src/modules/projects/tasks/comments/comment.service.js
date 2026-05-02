import { ApiError } from "../../../../core/utils/index.js";
import {
  createComment,
  findCommentById,
  findCommentsByTaskId,
  updateComment,
  deleteComment,
} from "./comment.repository.js";

import { extractMentions } from "./comment.utils.js";
import { createCommentMentions } from "./comment.mention.repository.js";
import { findUsersByUsernames } from "../../../auth/core/auth.repository.js";

import { createActivityService } from "../../../../core/activity/activity.service.js";
import { ACTIVITY_TYPES } from "../../../../core/constants/index.js";

// ! CREATE COMMENT SERVICE
export const createCommentService = async (taskId, userId, content) => {
  // 1️⃣ Create comment
  const comment = await createComment({
    taskId,
    authorId: userId,
    content,
  });

  // 2️⃣ Extract mentions from content
  const usernames = extractMentions(content);

  if (usernames.length > 0) {
    // 3️⃣ Find mentioned users by usernames
    const users = await findUsersByUsernames(usernames);

    // 4️⃣ Prepare mention records
    const mentionsData = users.map(user => ({
      commentId: comment.id,
      userId: user.id,
    }));

    // 5️⃣ Save mentions
    await createCommentMentions(mentionsData);

    // 6️⃣ Future : send notifications to mentioned users (non-blocking)
  }

  // 7️⃣ Log activity (non-blocking)
  createActivityService({
    actorId: userId,
    type: ACTIVITY_TYPES.COMMENT_ADDED,
    taskId,
    metadata: {
      entity: {
        id: comment.id,
      },
      extra: {
        preview: content.slice(0, 50), // small preview
        mentions: usernames, // for frontend
      },
    },
  });

  return comment;
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

  // 4️⃣ Log activity (non-blocking)
  createActivityService({
    actorId: userId,
    type: ACTIVITY_TYPES.COMMENT_DELETED,
    taskId: comment.taskId,
    metadata: {
      entity: {
        id: comment.id,
      },
    },
  });
  return true;
};
