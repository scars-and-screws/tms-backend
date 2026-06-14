import { Router } from "express";
import {
  createCommentController,
  listCommentsController,
} from "./comment.controller.js";

import {
  createCommentSchema,
  listCommentsSchema,
} from "./comment.validation.js";

import { validate } from "../../../../shared/middleware/index.js";

import {
  requireTaskAccess,
  requireActiveTask,
  requireTaskCommentAccess,
} from "../middleware/index.js";

import { requireActiveProject } from "../../../projects/middleware/index.js";

import commentAttachmentRoutes from "../attachments/attachment-comment.routes.js";

const router = Router({ mergeParams: true });

// ! CREATE COMMENT
router.post(
  "/",
  validate(createCommentSchema),
  requireTaskAccess,
  requireActiveProject,
  requireActiveTask,
  requireTaskCommentAccess,
  createCommentController
);

// ! LIST COMMENTS
router.get(
  "/",
  validate(listCommentsSchema),
  requireTaskAccess,
  requireActiveTask,
  listCommentsController
);

// ! COMMENT ATTACHMENT ROUTES
router.use("/:commentId/attachments", commentAttachmentRoutes);

export default router;
