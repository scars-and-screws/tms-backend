import { Router } from "express";
import {
  updateCommentController,
  deleteCommentController,
} from "./comment.controller.js";

import {
  updateCommentSchema,
  deleteCommentSchema,
} from "./comment.validation.js";

import {
  validate,
  requireCommentAccess,
  requireActiveProject,
  requireActiveTask,
} from "../../../../core/middleware/index.js";

const router = Router({ mergeParams: true });

// ! UPDATE COMMENT
router.patch(
  "/:commentId",
  validate(updateCommentSchema),
  requireCommentAccess,
  requireActiveProject,
  requireActiveTask,
  updateCommentController
);

// ! DELETE COMMENT
router.delete(
  "/:commentId",
  validate(deleteCommentSchema),
  requireCommentAccess,
  requireActiveProject,
  requireActiveTask,
  deleteCommentController
);

export default router;
