import { Router } from "express";

import {
  createTaskController,
  listTasksController,
} from "./task.controller.js";

import { createTaskSchema, listTasksSchema } from "./task.validation.js";

import {
  validate,
  requireProjectMember,
  requireActiveProject,
} from "../../../../core/middleware/index.js";

import attachmentTaskRoutes from "../attachments/attachment.task.routes.js";

const router = Router({ mergeParams: true });

// ! CREATE TASK
router.post(
  "/",
  validate(createTaskSchema),
  requireProjectMember,
  requireActiveProject,
  createTaskController
);

// ! ATTACHMENT ROUTES
router.use("/:taskId/attachments", attachmentTaskRoutes);

// ! LIST TASKS (read allowed even if archived)
router.get(
  "/",
  validate(listTasksSchema),
  requireProjectMember,
  listTasksController
);

export default router;
