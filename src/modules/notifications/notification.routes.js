import { Router } from "express";
import { validate } from "../../core/middleware/index.js";
import {
  listNotificationsController,
  markNotificationAsReadController,
} from "./notification.controller.js";
import { notificationIdParamSchema } from "./notification.validation.js";
import { notificationStreamController } from "./sse/sse.controller.js";

const router = Router();

// GET NOTIFICATIONS
router.get("/", listNotificationsController);
router.get("/stream", notificationStreamController);

// MARK AS READ
router.patch(
  "/:notificationId/read",
  validate(notificationIdParamSchema),
  markNotificationAsReadController
);

export default router;
