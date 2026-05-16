import { Router } from "express";
import {
  upload,
  validateUpload,
  UPLOAD_TYPES,
} from "../../../core/upload/index.js";
import { uploadOrganizationLogoController } from "./logo.controller.js";
import { organizationLogoParamSchema } from "./logo.validation.js";
import { validate } from "../../../core/middleware/index.js";

const router = Router({ mergeParams: true });

router.patch(
  "/",
  validate(organizationLogoParamSchema),
  upload.single("logo"),
  validateUpload(UPLOAD_TYPES.ORGANIZATION_LOGO),
  uploadOrganizationLogoController
);

export default router;
