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

import { findTaskNotificationData } from "../core/task.repository.js";
import {
  NOTIFICATION_TYPES,
  ENTITY_TYPES,
} from "../../../notifications/notification.constants.js";
import { notify } from "./comment.notification.js";

// ! CREATE COMMENT SERVICE
export const createCommentService = async (taskId, userId, content) => {
  // 1️⃣ Create the comment
  const comment = await createComment({
    taskId,
    authorId: userId,
    content,
  });

  // 2️⃣ Extract mentioned usernames from comment content

  const usernames = extractMentions(content);

  // Store mentioned users and IDs for later use
  let users = [];
  let mentionedUserIds = new Set();

  // 3️⃣ Process mentions if any usernames were found
  if (usernames.length > 0) {
    // Find users by usernames
    users = await findUsersByUsernames(usernames);

    // Prepare mention records for DB
    const mentionsData = users.map(user => ({
      commentId: comment.id,
      userId: user.id,
    }));

    // Save mentions in database
    await createCommentMentions(mentionsData);

    // Store mentioned user IDs in a Set
    // Used later to avoid duplicate notifications
    mentionedUserIds = new Set(users.map(user => user.id));
  }

  // 4️⃣ Get task data needed for notifications
  const taskData = await findTaskNotificationData(taskId);

  // Safety check
  if (!taskData) {
    throw new ApiError(404, "Task not found");
  }

  // 5️⃣ Collect task-related notification recipients
  // Using Set automatically removes duplicates
  const recipients = new Set();

  // Task creator
  if (taskData.createdById) {
    recipients.add(taskData.createdById);
  }

  // Current assignee
  if (taskData.assigneeId) {
    recipients.add(taskData.assigneeId);
  }

  // User who assigned the task
  if (taskData.assignedById) {
    recipients.add(taskData.assignedById);
  }

  // 6️⃣ Remove mentioned users from generic notifications
  // Because they will receive special "mention" notifications
  const filteredRecipients = [...recipients].filter(
    recipientId => !mentionedUserIds.has(recipientId)
  );

  // 7️⃣ Send generic comment notifications
  await Promise.all(
    filteredRecipients.map(recipientId =>
      notify(
        {
          userId: recipientId,
          type: NOTIFICATION_TYPES.COMMENT_ADDED,
          title: "New Comment",
          message: `New comment on task "${taskData.title}"`,
          entityId: taskData.id,
          entityType: ENTITY_TYPES.TASK,
        },
        userId // actorId (used to prevent self-notifications)
      )
    )
  );

  // 8️⃣ Send mention notifications
  await Promise.all(
    users.map(user =>
      notify(
        {
          userId: user.id,
          type: NOTIFICATION_TYPES.MENTIONED_IN_COMMENT,
          title: "Mentioned in Comment",
          message: `You were mentioned in task "${taskData.title}"`,
          entityId: taskData.id,
          entityType: ENTITY_TYPES.TASK,
        },
        userId
      )
    )
  );

  // 9️⃣ Log activity (non-blocking)
  createActivityService({
    actorId: userId,
    type: ACTIVITY_TYPES.COMMENT_ADDED,
    taskId,
    metadata: {
      entity: {
        id: comment.id,
      },
      extra: {
        preview: content.slice(0, 50),
        mentions: usernames,
      },
    },
  });

  // 🔟 Return created comment
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
