import { Router } from "express";
import { deleteAttachmentController } from "./attachment.controller.js";
import { deleteAttachmentParamSchema } from "./attachment.validation.js";
import { validate } from "../../../../core/middleware/index.js";
import { requireAttachmentAccess } from "../../../../core/middleware/index.js";

const router = Router({ mergeParams: true });

// ! DELETE ATTACHMENT ROUTE
router.delete(
  "/:fileId",
  validate(deleteAttachmentParamSchema),
  requireAttachmentAccess,
  deleteAttachmentController
);

export default router;
