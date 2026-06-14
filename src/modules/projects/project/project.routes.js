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
import { validate } from "../../../shared/middleware/index.js";
import {
  requireProjectMember,
  requireActiveProject,
  requireProjectRole,
} from "../middleware/index.js";

import { requireOrganizationRole } from "../../organizations/middleware/index.js";

import { leaveProjectController } from "../members/project-members.controller.js";
import { leaveProjectSchema } from "../members/project-members.validation.js";
import projectMemberRoutes from "../members/project-members.routes.js";
import taskProjectRoutes from "../tasks/task/project-tasks.routes.js";
import projectActivityRoutes from "../../activity/activity/project-activity.routes.js";

const router = Router({ mergeParams: true });

// ! CREATE PROJECT
router.post(
  "/",
  validate(createProjectSchema),
  requireOrganizationRole(["OWNER", "ADMIN"]),
  createProjectController
);

// ! LIST PROJECTS
router.get("/", validate(listProjectsSchema), listProjectsController);

// ! GET PROJECT
router.get(
  "/:projectId",
  validate(getProjectIdParamSchema),
  requireProjectMember,
  getProjectController
);

// ! UPDATE PROJECT
router.patch(
  "/:projectId",
  validate(updateProjectSchema),
  requireProjectMember,
  requireActiveProject,
  requireProjectRole(["ADMIN"]),
  updateProjectController
);

// ! ARCHIVE PROJECT
router.patch(
  "/:projectId/archive",
  validate(archiveProjectSchema),
  requireProjectMember,
  requireActiveProject,
  requireProjectRole(["ADMIN"]),
  archiveProjectController
);

// ! UNARCHIVE PROJECT
router.patch(
  "/:projectId/unarchive",
  validate(unarchiveProjectSchema),
  requireProjectMember,
  requireProjectRole(["ADMIN"]),
  unarchiveProjectController
);

// ! LEAVE PROJECT
router.post(
  "/:projectId/leave",
  validate(leaveProjectSchema),
  requireProjectMember,
  leaveProjectController
);

// ! DELETE PROJECT
router.delete(
  "/:projectId",
  validate(deleteProjectSchema),
  requireProjectMember,
  requireProjectRole(["ADMIN"]),
  requireActiveProject,
  deleteProjectController
);

// ! PROJECT ACTIVITY
router.use("/:projectId/activities", projectActivityRoutes);

// ! NESTED ROUTES FOR PROJECT MEMBERS
router.use("/:projectId/members", projectMemberRoutes);

// ! NESTED ROUTES FOR TASKS
router.use("/:projectId/tasks", taskProjectRoutes);

export default router;
