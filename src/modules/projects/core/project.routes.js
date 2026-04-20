import { Router } from "express";
import {
  createProjectSchema,
  deleteProjectSchema,
  getProjectIdParamSchema,
  updateProjectSchema,
  listProjectsSchema,
  archiveProjectSchema,
  unarchiveProjectSchema,
} from "./project.validation.js";
import {
  createProjectController,
  listProjectsController,
  getProjectController,
  updateProjectController,
  deleteProjectController,
  archiveProjectController,
  unarchiveProjectController,
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
router.get("/", validate(listProjectsSchema), listProjectsController);

// ! GET PROJECT
router.get(
  "/:projectId",
  requireProjectMember,
  validate(getProjectIdParamSchema),
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

// ! ARCHIVE PROJECT
router.post(
  "/:projectId/archive",
  requireProjectMember,
  requireProjectRole(["ADMIN"]),
  validate(archiveProjectSchema),
  archiveProjectController
);

// ! UNARCHIVE PROJECT
router.post(
  "/:projectId/unarchive",
  requireProjectMember,
  requireProjectRole(["ADMIN"]),
  validate(unarchiveProjectSchema),
  unarchiveProjectController
);

// ! LEAVE PROJECT
router.post(
  "/:projectId/leave",
  requireProjectMember,
  validate(leaveProjectSchema),
  leaveProjectController
);

// ! DELETE PROJECT
router.delete(
  "/:projectId",
  requireProjectMember,
  requireProjectRole(["ADMIN"]),
  validate(deleteProjectSchema),
  deleteProjectController
);

// ! NESTED ROUTES FOR PROJECT MEMBERS
router.use("/:projectId/members", projectMemberRoutes);

export default router;
