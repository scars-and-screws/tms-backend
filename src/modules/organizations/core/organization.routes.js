import { Router } from "express";
import { memberRoutes } from "../members/index.js";
import { logoRoutes } from "../logo/index.js";
import {
  validate,
  requireOrganizationMember,
  requireOrganizationRole,
} from "../../../core/middleware/index.js";
import {
  createOrganizationController,
  createOrganizationSchema,
  getOrganizationController,
  listUserOrganizationsController,
  organizationIdParamSchema,
  transferOwnershipController,
  transferOwnershipSchema,
  updateOrganizationController,
  updateOrganizationSchema,
  leaveOrganizationController,
  leaveOrganizationSchema,
  deleteOrganizationController,
  deleteOrganizationSchema,
} from "../index.js";

const router = Router();

// ! CREATE ORGANIZATION ROUTE
router.post(
  "/",
  validate(createOrganizationSchema),
  createOrganizationController
);

// ! LIST USER ORGANIZATIONS ROUTE
router.get("/", listUserOrganizationsController);

// ! GET ORGANIZATION ROUTE
router.get(
  "/:organizationId",
  requireOrganizationMember,
  validate(organizationIdParamSchema),
  getOrganizationController
);

// ! UPDATE ORGANIZATION ROUTE
router.patch(
  "/:organizationId",
  requireOrganizationMember,
  requireOrganizationRole(["OWNER", "ADMIN"]),
  validate(updateOrganizationSchema),
  updateOrganizationController
);

// ! ORGANIZATION LOGO ROUTES
router.use(
  "/:organizationId/logo",
  requireOrganizationMember,
  requireOrganizationRole(["OWNER", "ADMIN"]),
  logoRoutes
);

// ! NESTED MEMBER ROUTES
router.use("/:organizationId/members", requireOrganizationMember, memberRoutes);

// ! TRANSFER OWNERSHIP ROUTE
router.post(
  "/:organizationId/transfer-ownership",
  requireOrganizationMember,
  requireOrganizationRole(["OWNER"]),
  validate(transferOwnershipSchema),
  transferOwnershipController
);

// ! LEAVE ORGANIZATION ROUTE
router.post(
  "/:organizationId/leave",
  requireOrganizationMember,
  validate(leaveOrganizationSchema),
  leaveOrganizationController
);

// ! DELETE ORGANIZATION ROUTE
router.delete(
  "/:organizationId",
  requireOrganizationMember,
  requireOrganizationRole(["OWNER"]),
  validate(deleteOrganizationSchema),
  deleteOrganizationController
);

export default router;
