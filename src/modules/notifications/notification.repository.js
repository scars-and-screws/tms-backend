import prisma from "../../core/database/prisma.js";

// ! CREATE NOTIFICATION
export const createNotification = data => {
  return prisma.notification.create({ data });
};

// ! GET USER NOTIFICATIONS WITH PAGINATION
export const findUserNotifications = (userId, skip, limit) => {
  return prisma.notification.findMany({
    where: { userId },

    orderBy: { createdAt: "desc" },

    skip,
    take: limit,
  });
};

// ! COUNT USER NOTIFICATIONS
export const countUserNotifications = userId => {
  return prisma.notification.count({
    where: { userId },
  });
};

// ! MARK AS READ
export const markNotificationAsRead = (notificationId, userId) => {
  return prisma.notification.update({
    where: { id: notificationId, userId },
    data: { isRead: true },
  });
};
