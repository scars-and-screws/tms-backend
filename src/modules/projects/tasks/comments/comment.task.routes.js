import { Router } from "express";
import {
  createCommentController,
  listCommentsController,
} from "./comment.controller.js";

import {
  createCommentSchema,
  listCommentsSchema,
} from "./comment.validation.js";

import {
  validate,
  requireTaskAccess,
  requireCommentAccess,
  requireActiveProject,
  requireActiveTask,
} from "../../../../core/middleware/index.js";

import commentAttachmentRoutes from "../attachments/attachment.comment.routes.js";

const router = Router({ mergeParams: true });

// ! CREATE COMMENT
router.post(
  "/",
  validate(createCommentSchema),
  requireTaskAccess,
  requireActiveProject,
  requireActiveTask,
  createCommentController
);

// ! LIST COMMENTS
router.get(
  "/",
  validate(listCommentsSchema),
  requireTaskAccess,
  listCommentsController
);

// ! COMMENT ATTACHMENT ROUTES
router.use("/:commentId/attachments", commentAttachmentRoutes);

export default router;
