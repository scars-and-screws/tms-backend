import {
  createNotification,
  findUserNotifications,
  countUserNotifications,
  markNotificationAsRead,
} from "./notification.repository.js";

import {
  getPagination,
  buildPaginationMeta,
} from "../../shared/pagination/pagination.utils.js";

import { sendToUser } from "./sse/notification-sse.manager.js";

import { ApiError } from "../../shared/errors/api-error.js";

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
export const listNotificationsService = async (userId, query) => {
  // 1️⃣ Get normalized pagination values
  const pagination = getPagination(query);

  // 2️⃣ Fetch notifications + total count in parallel
  const [notifications, total] = await Promise.all([
    findUserNotifications({
      userId,
      skip: pagination.skip,
      limit: pagination.limit,
    }),

    countUserNotifications(userId),
  ]);

  // 3️⃣ Build pagination metadata
  const paginationMeta = buildPaginationMeta({
    total,
    page: pagination.page,
    limit: pagination.limit,
  });

  // 4️⃣ Return consistent paginated response
  return {
    notifications,
    pagination: paginationMeta,
  };
};

// ! MARK NOTIFICATION AS READ SERVICE
export const markNotificationAsReadService = async (notificationId, userId) => {
  return markNotificationAsRead(notificationId, userId);
};
