import { Router } from "express";
import {
  uploadService,
  validateUpload,
  UPLOAD_TYPES,
} from "../../../../infrastructure/storage/index.js";

import {
  uploadTaskAttachmentController,
  listTaskAttachmentsController,
  deleteAttachmentController,
} from "./attachment.controller.js";

import { validate } from "../../../../shared/middleware/index.js";

import {
  taskAttachmentParamSchema,
  deleteTaskAttachmentParamSchema,
  listTaskAttachmentsSchema,
} from "./attachment.validation.js";

import { requireTaskAccess, requireActiveTask } from "../middleware/index.js";

import { requireActiveProject } from "../../../projects/middleware/index.js";

const router = Router({ mergeParams: true });

// ! UPLOAD ATTACHMENT ROUTE
router.post(
  "/",
  validate(taskAttachmentParamSchema),
  requireTaskAccess,
  requireActiveProject,
  requireActiveTask,
  uploadService.array("files", 5), // allow up to 5 files
  validateUpload(UPLOAD_TYPES.ATTACHMENT),
  uploadTaskAttachmentController
);

// ! LIST ATTACHMENTS ROUTE
router.get(
  "/",
  validate(listTaskAttachmentsSchema),
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
