import { Router } from "express";
import {
  uploadService,
  validateUpload,
  UPLOAD_TYPES,
} from "../../../../infrastructure/storage/index.js";

import {
  uploadCommentAttachmentController,
  listCommentAttachmentsController,
  deleteAttachmentController,
} from "./attachment.controller.js";
import {
  commentAttachmentParamSchema,
  deleteCommentAttachmentParamSchema,
} from "./attachment.validation.js";

import { validate } from "../../../../shared/middleware/index.js";

import { requireActiveProject } from "../../../projects/middleware/index.js";
import {
  requireTaskCommentAccess,
  requireActiveTask,
} from "../middleware/index.js";

const router = Router({ mergeParams: true });

// ! UPLOAD COMMENT ATTACHMENT
router.post(
  "/",
  validate(commentAttachmentParamSchema),
  requireTaskCommentAccess,
  requireActiveProject,
  requireActiveTask,
  uploadService.array("files", 5),
  validateUpload(UPLOAD_TYPES.ATTACHMENT),
  uploadCommentAttachmentController
);

// ! LIST COMMENT ATTACHMENTS
router.get(
  "/",
  validate(commentAttachmentParamSchema),
  requireTaskCommentAccess,
  listCommentAttachmentsController
);

// ! DELETE COMMENT ATTACHMENT
router.delete(
  "/:fileId",
  validate(deleteCommentAttachmentParamSchema),
  requireTaskCommentAccess,
  requireActiveProject,
  requireActiveTask,
  deleteAttachmentController
);

export default router;
