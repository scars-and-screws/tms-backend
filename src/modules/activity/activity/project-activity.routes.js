import { Router } from "express";

import { requireProjectMember } from "../../projects/middleware/index.js";
import { validate } from "../../../shared/middleware/index.js";

import { listProjectActivitiesController } from "./activity.controller.js";

import {
  projectActivityParamsSchema,
  projectActivityQuerySchema,
} from "./activity.validation.js";

import { activityStreamController } from "../sse/activity-sse.controller.js";

const router = Router({ mergeParams: true });

// ! LIST PROJECT ACTIVITIES
router.get(
  "/stream",
  validate(projectActivityParamsSchema),
  requireProjectMember,
  activityStreamController
);

router.get(
  "/",
  validate(projectActivityParamsSchema),
  validate(projectActivityQuerySchema),
  requireProjectMember,
  listProjectActivitiesController
);

export default router;
