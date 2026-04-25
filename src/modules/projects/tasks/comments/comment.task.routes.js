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

export default router;
