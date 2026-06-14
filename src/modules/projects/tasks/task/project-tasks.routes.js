import { Router } from "express";

import {
  createTaskController,
  listTasksController,
} from "./task.controller.js";

import { createTaskSchema, listTasksSchema } from "./task.validation.js";

import { validate } from "../../../../shared/middleware/index.js";
import {
  requireActiveProject,
  requireProjectMember,
} from "../../../projects/middleware/index.js";

import taskAttachmentRoutes from "../attachments/attachment-task.routes.js";
import commentTaskRoutes from "../comments/task-comments.routes.js";

const router = Router({ mergeParams: true });

// ! CREATE TASK
router.post(
  "/",
  validate(createTaskSchema),
  requireProjectMember,
  requireActiveProject,
  createTaskController
);

// ! LIST TASKS (read allowed even if archived)
router.get(
  "/",
  validate(listTasksSchema),
  requireProjectMember,
  requireActiveProject,
  listTasksController
);

// ! ATTACHMENT ROUTES
router.use("/:taskId/attachments", taskAttachmentRoutes);

// ! COMMENT ROUTES
router.use("/:taskId/comments", commentTaskRoutes);

export default router;
