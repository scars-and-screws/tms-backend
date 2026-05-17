import { Router } from "express";

import { validate, requireProjectMember } from "../middleware/index.js";
import { listProjectActivitiesController } from "./activity.controller.js";

import {
  projectActivityParamsSchema,
  projectActivityQuerySchema,
} from "./activity.validation.js";

const router = Router({ mergeParams: true });

// ! LIST PROJECT ACTIVITIES
router.get(
  "/",
  validate(projectActivityParamsSchema),
  validate(projectActivityQuerySchema),
  requireProjectMember,
  listProjectActivitiesController
);

export default router;
