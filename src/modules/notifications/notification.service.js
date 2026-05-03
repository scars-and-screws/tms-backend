import {
  createNotification,
  findUserNotifications,
  markNotificationAsRead,
} from "./notification.repository.js";

import { sendToUser } from "./sse/sse.manager.js";

import { ApiError } from "../../core/utils/index.js";

// ! CREATE NOTIFICATION SERVICE
export const createNotificationService = async data => {
  if (!data.userId) {
    throw new ApiError(400, "UserId is required");
  }

  const notification = await createNotification(data);

  // Send real-time update to user via SSE
  sendToUser(data.userId, notification);

  return notification;
};

// ! LIST NOTIFICATIONS SERVICE
export const listNotificationsService = async userId => {
  return findUserNotifications(userId);
};

// ! MARK NOTIFICATION AS READ SERVICE
export const markNotificationAsReadService = async (notificationId, userId) => {
  return markNotificationAsRead(notificationId, userId);
};
