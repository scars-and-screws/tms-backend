import { Router } from "express";

import OrganizationMemberRoutes from "../members/organization-members.routes.js";

import logoRoutes from "../logos/logo.routes.js";

import {
  requireOrganizationMember,
  requireOrganizationRole,
} from "../middleware/index.js";

import { validate } from "../../../shared/middleware/index.js";

import {
  createOrganizationController,
  getOrganizationController,
  listUserOrganizationsController,
  transferOrganizationOwnershipController,
  updateOrganizationController,
  leaveOrganizationController,
  deleteOrganizationController,
} from "./organization.controller.js";

import {
  organizationIdParamSchema,
  createOrganizationSchema,
  transferOrganizationOwnershipSchema,
  updateOrganizationSchema,
  leaveOrganizationSchema,
  deleteOrganizationSchema,
  listOrganizationsSchema,
} from "./organization.validation.js";

import organizationActivityRoutes from "../../activity/activity/organization-activity.routes.js";

import projectRoutes from "../../projects/project/project.routes.js";

const router = Router();

// ! CREATE ORGANIZATION ROUTE
router.post(
  "/",
  validate(createOrganizationSchema),
  createOrganizationController
);

// ! LIST USER ORGANIZATIONS ROUTE
router.get(
  "/",
  validate(listOrganizationsSchema),
  listUserOrganizationsController
);

// ! GET ORGANIZATION ROUTE
router.get(
  "/:organizationId",
  validate(organizationIdParamSchema),
  requireOrganizationMember,
  getOrganizationController
);

// ! UPDATE ORGANIZATION ROUTE
router.patch(
  "/:organizationId",
  validate(updateOrganizationSchema),
  requireOrganizationMember,
  requireOrganizationRole(["OWNER", "ADMIN"]),
  updateOrganizationController
);

// ! ORGANIZATION LOGO ROUTES
router.use(
  "/:organizationId/logo",
  requireOrganizationMember,
  requireOrganizationRole(["OWNER", "ADMIN"]),
  logoRoutes
);

// ! NESTED ORGANIZATION MEMBER ROUTES
router.use(
  "/:organizationId/members",
  requireOrganizationMember,
  OrganizationMemberRoutes
);

// ! TRANSFER OWNERSHIP ROUTE
router.post(
  "/:organizationId/transfer-ownership",
  validate(transferOrganizationOwnershipSchema),
  requireOrganizationMember,
  requireOrganizationRole(["OWNER"]),
  transferOrganizationOwnershipController
);

// ! LEAVE ORGANIZATION ROUTE
router.post(
  "/:organizationId/leave",
  validate(leaveOrganizationSchema),
  requireOrganizationMember,
  leaveOrganizationController
);

// ! DELETE ORGANIZATION ROUTE
router.delete(
  "/:organizationId",
  validate(deleteOrganizationSchema),
  requireOrganizationMember,
  requireOrganizationRole(["OWNER"]),
  deleteOrganizationController
);

// ! ORGANIZATION ACTIVITY ROUTES
router.use("/:organizationId/activities", organizationActivityRoutes);

// ! NESTED PROJECT ROUTES
router.use(
  "/:organizationId/projects",
  requireOrganizationMember,
  projectRoutes
);

export default router;
