import { Router } from "express";
import {
  getTaskController,
  updateTaskController,
  deleteTaskController,
  assignTaskController,
  updateTaskStatusController,
  archiveTaskController,
  unarchiveTaskController,
} from "./task.controller.js";

import {
  createTaskSchema,
  updateTaskSchema,
  assignTaskSchema,
  getTaskSchema,
  deleteTaskSchema,
  listTasksSchema,
  updateTaskStatusSchema,
  archiveTaskSchema,
  unarchiveTaskSchema,
} from "./task.validation.js";

import {
  validate,
  requireProjectMember,
  requireProjectRole,
  requireActiveProject,
  requireTaskAccess,
  requireActiveTask,
} from "../../../../core/middleware/index.js";

const router = Router({ mergeParams: true });

// ! TASK-BASED ROUTES (need taskId in params)
//  GET TASK
router.get(
  "/:taskId",
  validate(getTaskSchema),
  requireTaskAccess,
  getTaskController
);

//  UPDATE TASK
router.patch(
  "/:taskId",
  validate(updateTaskSchema),
  requireTaskAccess,
  requireActiveProject,
  requireActiveTask,
  updateTaskController
);

//  DELETE TASK
router.delete(
  "/:taskId",
  validate(deleteTaskSchema),
  requireTaskAccess,
  requireActiveProject,
  requireActiveTask,
  requireProjectRole(["ADMIN"]),
  deleteTaskController
);

// ! ACTION ROUTES
//  ASSIGN TASK
router.patch(
  "/:taskId/assign",
  validate(assignTaskSchema),
  requireTaskAccess,
  requireActiveProject,
  requireActiveTask,
  requireProjectRole(["ADMIN"]),
  assignTaskController
);

//  UPDATE TASK STATUS
router.patch(
  "/:taskId/status",
  validate(updateTaskStatusSchema),
  requireTaskAccess,
  requireActiveProject,
  requireActiveTask,
  updateTaskStatusController
);

//  ARCHIVE TASK
router.patch(
  "/:taskId/archive",
  validate(archiveTaskSchema),
  requireTaskAccess,
  requireActiveProject,
  requireActiveTask,
  requireProjectRole(["ADMIN"]),
  archiveTaskController
);

// UNARCHIVE TASK
router.patch(
  "/:taskId/unarchive",
  validate(unarchiveTaskSchema),
  requireTaskAccess,
  requireProjectRole(["ADMIN"]),
  unarchiveTaskController
);

export default router;
