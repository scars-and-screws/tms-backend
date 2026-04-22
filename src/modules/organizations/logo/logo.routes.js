import { Router } from "express";
import { upload, validateUpload } from "../../../core/upload/index.js";
import { uploadOrganizationLogoController } from "./logo.controller.js";
import { organizationIdParamSchema } from "../core/organization.validation.js";
import { validate } from "../../../core/middleware/index.js";

const router = Router({ mergeParams: true });

router.patch(
  "/",
  validate(organizationIdParamSchema),
  upload.single("organization_logo"),
  validateUpload("organization_logo"),
  uploadOrganizationLogoController
);

export default router;
