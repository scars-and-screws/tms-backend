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

import attachmentTaskRoutes from "../attachments/taskAttachment.task.routes.js";
import commentTaskRoutes from "../comments/comment.task.routes.js";

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

// ! COMMENT ROUTES
router.use("/:taskId/comments", commentTaskRoutes);

export default router;
