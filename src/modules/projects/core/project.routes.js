import { Router } from "express";
import {
  createProjectSchema,
  deleteProjectSchema,
  projectIdParamSchema,
  updateProjectSchema,
} from "./project.validation.js";
import {
  createProjectController,
  listProjectsController,
  getProjectController,
  updateProjectController,
  deleteProjectController,
} from "./project.controller.js";
import {
  validate,
  requireOrganizationRole,
  requireProjectMember,
  requireProjectRole,
} from "../../../core/middleware/index.js";
import {
  leaveProjectController,
  leaveProjectSchema,
} from "../members/index.js";
import projectMemberRoutes from "../members/projectMember.routes.js";

const router = Router({ mergeParams: true });

// ! CREATE PROJECT
router.post(
  "/",
  requireOrganizationRole(["OWNER", "ADMIN"]),
  validate(createProjectSchema),
  createProjectController
);

// ! LIST PROJECTS
router.get("/", listProjectsController);

// ! GET PROJECT
router.get(
  "/:projectId",
  requireProjectMember,
  validate(projectIdParamSchema),
  getProjectController
);

// ! UPDATE PROJECT
router.patch(
  "/:projectId",
  requireProjectMember,
  requireProjectRole(["ADMIN"]),
  validate(updateProjectSchema),
  updateProjectController
);

// ! DELETE PROJECT
router.delete(
  "/:projectId",
  requireProjectMember,
  requireProjectRole(["ADMIN"]),
  validate(deleteProjectSchema),
  deleteProjectController
);

// ! LEAVE PROJECT
router.post(
  "/:projectId/leave",
  requireProjectMember,
  validate(leaveProjectSchema),
  leaveProjectController
);

// ! NESTED ROUTES FOR PROJECT MEMBERS
router.use("/:projectId/members", projectMemberRoutes);

export default router;
