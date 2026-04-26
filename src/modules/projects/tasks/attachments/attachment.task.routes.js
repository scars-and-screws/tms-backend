import { Router } from "express";
import { upload, validateUpload } from "../../../../core/upload/index.js";
import {
  uploadTaskAttachmentController,
  listTaskAttachmentsController,
  deleteAttachmentController,
} from "./attachment.controller.js";

import { UPLOAD_TYPES } from "../../../../core/constants/uploadTypes.js";

import { validate } from "../../../../core/middleware/index.js";

import {
  taskAttachmentParamSchema,
  deleteTaskAttachmentParamSchema,
} from "./attachment.validation.js";

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
  validateUpload(UPLOAD_TYPES.ATTACHMENT),
  uploadTaskAttachmentController
);

// ! LIST ATTACHMENTS ROUTE
router.get(
  "/",
  validate(taskAttachmentParamSchema),
  requireTaskAccess,
  listTaskAttachmentsController
);

// ! DELETE ATTACHMENT ROUTE
router.delete(
  "/:fileId",
  validate(deleteTaskAttachmentParamSchema),
  requireTaskAccess,
  requireActiveProject,
  requireActiveTask,
  deleteAttachmentController
);

export default router;
