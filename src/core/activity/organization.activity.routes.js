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

const router = Router({ mergeParams: true });

// ! LIST ORGANIZATION ACTIVITIES
router.get(
  "/",
  validate(organizationActivityParamsSchema),
  validate(organizationActivityQuerySchema),
  requireOrganizationMember,
  requireOrganizationRole(["OWNER", "ADMIN"]),
  listOrganizationActivitiesController
);

export default router;
