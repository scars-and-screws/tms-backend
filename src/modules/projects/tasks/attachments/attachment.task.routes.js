import { Router } from "express";
import { upload, validateUpload } from "../../../../core/upload/index.js";
import {
  uploadAttachmentController,
  listAttachmentsController,
} from "./attachment.controller.js";

import { validate } from "../../../../core/middleware/index.js";

import { attachmentParamSchema } from "./attachment.validation.js";

import {
  requireTaskAccess,
  requireActiveProject,
  requireActiveTask,
} from "../../../../core/middleware/index.js";

const router = Router({ mergeParams: true });

// ! UPLOAD ATTACHMENT ROUTE
router.post(
  "/",
  validate(attachmentParamSchema),
  requireTaskAccess,
  requireActiveProject,
  requireActiveTask,
  upload.array("files", 5), // allow up to 5 files
  validateUpload("attachment"),
  uploadAttachmentController
);

// ! LIST ATTACHMENTS ROUTE
router.get(
  "/",
  validate(attachmentParamSchema),
  requireTaskAccess,
  listAttachmentsController
);

export default router;
