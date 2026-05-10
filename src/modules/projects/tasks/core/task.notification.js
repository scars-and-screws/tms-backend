import { createNotificationService } from "../../../notifications/notification.service.js";

// ? HELPER FUNCTION TO SEND NOTIFICATIONS, AVOIDING SELF-NOTIFICATIONS
export const notify = async (payload, actorId) => {
  if (payload.userId === actorId) return;
  return createNotificationService(payload);
};
