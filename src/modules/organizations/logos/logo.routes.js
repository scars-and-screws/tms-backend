import { Router } from "express";
import {
  uploadService,
  validateUpload,
  UPLOAD_TYPES,
} from "../../../infrastructure/storage/index.js";
import { uploadOrganizationLogoController } from "./logo.controller.js";
import { organizationLogoParamSchema } from "./logo.validation.js";
import { validate } from "../../../shared/middleware/index.js";

const router = Router({ mergeParams: true });

router.patch(
  "/",
  validate(organizationLogoParamSchema),
  uploadService.single("logo"),
  validateUpload(UPLOAD_TYPES.ORGANIZATION_LOGO),
  uploadOrganizationLogoController
);

export default router;
