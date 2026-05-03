import { asyncHandler, ApiResponse } from "../../core/utils/index.js";
import {
  listNotificationsService,
  markNotificationAsReadService,
} from "./notification.service.js";

// ! LIST NOTIFICATIONS CONTROLLER
export const listNotificationsController = asyncHandler(async (req, res) => {
  const notifications = await listNotificationsService(req.user.id);

  return res
    .status(200)
    .json(new ApiResponse(200, notifications, "Notifications retrieved"));
});

// ! MARK NOTIFICATION AS READ CONTROLLER
export const markNotificationAsReadController = asyncHandler(
  async (req, res) => {
    const { notificationId } = req.params;

    await markNotificationAsReadService(notificationId, req.user.id);

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Notification marked as read"));
  }
);
