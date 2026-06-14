import { asyncHandler } from "../../shared/utils/index.js";
import { ApiResponse } from "../../shared/responses/api-response.js";
import {
  listNotificationsService,
  markNotificationAsReadService,
} from "./notification.service.js";

// ! LIST NOTIFICATIONS CONTROLLER
export const listNotificationsController = asyncHandler(async (req, res) => {
  const result = await listNotificationsService(req.user.id, req.query);

  return res
    .status(200)
    .json(new ApiResponse(200, result, "Notifications retrieved"));
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
