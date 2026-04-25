import { Router } from "express";
import { upload, validateUpload } from "../../../../core/upload/index.js";
import {
  uploadTaskAttachmentController,
  listTaskAttachmentsController,
} from "./taskAttachment.controller.js";

import { validate } from "../../../../core/middleware/index.js";

import { taskAttachmentParamSchema } from "./taskAttachment.validation.js";

import {
  requireTaskAccess,
  requireActiveProject,
  requireActiveTask,
} from "../../../../core/middleware/index.js";

const router = Router({ mergeParams: true });

// ! UPLOAD ATTACHMENT ROUTE
router.post(
  "/",
  validate(taskAttachmentParamSchema),
  requireTaskAccess,
  requireActiveProject,
  requireActiveTask,
  upload.array("files", 5), // allow up to 5 files
  validateUpload("attachment"),
  uploadTaskAttachmentController
);

// ! LIST ATTACHMENTS ROUTE
router.get(
  "/",
  validate(taskAttachmentParamSchema),
  requireTaskAccess,
  listTaskAttachmentsController
);

export default router;
