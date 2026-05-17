import { Router } from "express";

import { validate, requireTaskAccess } from "../middleware/index.js";
import { listTaskActivitiesController } from "./activity.controller.js";

import {
  taskActivityParamsSchema,
  taskActivityQuerySchema,
} from "./activity.validation.js";

const router = Router({ mergeParams: true });

// ! LIST TASK ACTIVITIES
router.get(
  "/",
  validate(taskActivityParamsSchema),
  validate(taskActivityQuerySchema),
  requireTaskAccess,
  listTaskActivitiesController
);

export default router;
