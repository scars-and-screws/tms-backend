import { Router } from "express";
import { upload, validateUpload } from "../../../../core/upload/index.js";

import { UPLOAD_TYPES } from "../../../../core/constants/uploadTypes.js";

import {
  uploadCommentAttachmentController,
  listCommentAttachmentsController,
  deleteAttachmentController,
} from "./attachment.controller.js";
import {
  commentAttachmentParamSchema,
  deleteCommentAttachmentParamSchema,
} from "./attachment.validation.js";

import {
  validate,
  requireCommentAccess,
  requireActiveProject,
  requireActiveTask,
} from "../../../../core/middleware/index.js";

const router = Router({ mergeParams: true });

// ! UPLOAD COMMENT ATTACHMENT
router.post(
  "/",
  validate(commentAttachmentParamSchema),
  requireCommentAccess,
  requireActiveProject,
  requireActiveTask,
  upload.array("files", 5),
  validateUpload(UPLOAD_TYPES.ATTACHMENT),
  uploadCommentAttachmentController
);

// ! LIST COMMENT ATTACHMENTS
router.get(
  "/",
  validate(commentAttachmentParamSchema),
  requireCommentAccess,
  listCommentAttachmentsController
);

// ! DELETE COMMENT ATTACHMENT
router.delete(
  "/:fileId",
  validate(deleteCommentAttachmentParamSchema),
  requireCommentAccess,
  requireActiveProject,
  requireActiveTask,
  deleteAttachmentController
);

export default router;
