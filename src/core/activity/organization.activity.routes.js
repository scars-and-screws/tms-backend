import { Router } from "express";

import {
  validate,
  requireOrganizationMember,
  requireOrganizationRole,
} from "../middleware/index.js";

import { listOrganizationActivitiesController } from "./activity.controller.js";

import {
  organizationActivityParamsSchema,
  organizationActivityQuerySchema,
} from "./activity.validation.js";

import { activityStreamController } from "./sse/activity.sse.controller.js";

const router = Router({ mergeParams: true });

// ! LIST ORGANIZATION ACTIVITIES
router.get(
  "/stream",
  validate(organizationActivityParamsSchema),
  requireOrganizationMember,
  requireOrganizationRole(["OWNER", "ADMIN"]),
  activityStreamController
);

router.get(
  "/",
  validate(organizationActivityParamsSchema),
  validate(organizationActivityQuerySchema),
  requireOrganizationMember,
  requireOrganizationRole(["OWNER", "ADMIN"]),
  listOrganizationActivitiesController
);

export default router;
