import { createNotificationService } from "../../../notifications/notification.service.js";

// ? HELPER FUNCTION TO SEND NOTIFICATIONS AND PREVENT SELF NOTIFICATIONS
export const notify = async (payload, actorId) => {
  if (!payload.userId) return;

  // prevent self notification
  if (payload.userId === actorId) return;

  return createNotificationService(payload);
};
