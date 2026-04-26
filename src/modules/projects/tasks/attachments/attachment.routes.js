import { Router } from "express";
import { deleteTaskAttachmentController } from "./attachment.controller.js";
import { deleteTaskAttachmentParamSchema } from "./attachment.validation.js";
import { validate } from "../../../../core/middleware/index.js";
import { requireTaskAttachmentAccess } from "../../../../core/middleware/index.js";

const router = Router({ mergeParams: true });

// ! DELETE TASK ATTACHMENT ROUTE
router.delete(
  "/:fileId",
  validate(deleteTaskAttachmentParamSchema),
  requireTaskAttachmentAccess,
  deleteTaskAttachmentController
);

export default router;
