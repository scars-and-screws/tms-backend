import prisma from "../../core/database/prisma.js";

// ! CREATE NOTIFICATION
export const createNotification = data => {
  return prisma.notification.create({ data });
};

// ! GET USER NOTIFICATIONS
export const findUserNotifications = userId => {
  return prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 20,
  });
};

// ! MARK AS READ
export const markNotificationAsRead = (notificationId, userId) => {
  return prisma.notification.update({
    where: { id: notificationId },
    data: { isRead: true },
  });
};
