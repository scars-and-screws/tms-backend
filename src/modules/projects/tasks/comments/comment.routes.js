import { Router } from "express";
import {
  updateCommentController,
  deleteCommentController,
} from "./comment.controller.js";

import {
  updateCommentSchema,
  deleteCommentSchema,
} from "./comment.validation.js";

import { validate } from "../../../../shared/middleware/index.js";

import { requireActiveProject } from "../../../projects/middleware/index.js";

import {
  requireTaskCommentAccess,
  requireActiveTask,
} from "../middleware/index.js";

const router = Router({ mergeParams: true });

// ! UPDATE COMMENT
router.patch(
  "/:commentId",
  validate(updateCommentSchema),
  requireTaskCommentAccess,
  requireActiveProject,
  requireActiveTask,
  updateCommentController
);

// ! DELETE COMMENT
router.delete(
  "/:commentId",
  validate(deleteCommentSchema),
  requireTaskCommentAccess,
  requireActiveProject,
  requireActiveTask,
  deleteCommentController
);

export default router;
