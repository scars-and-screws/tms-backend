import { Router } from "express";
import { validate } from "../../shared/middleware/index.js";
import {
  listNotificationsController,
  markNotificationAsReadController,
} from "./notification.controller.js";
import {
  notificationIdParamSchema,
  listNotificationsQuerySchema,
} from "./notification.validation.js";
import { notificationStreamController } from "./sse/notification-sse.controller.js";

const router = Router();

// GET NOTIFICATIONS
router.get(
  "/",
  validate(listNotificationsQuerySchema),
  listNotificationsController
);
router.get("/stream", notificationStreamController);

// MARK AS READ
router.patch(
  "/:notificationId/read",
  validate(notificationIdParamSchema),
  markNotificationAsReadController
);

export default router;
