import { Router } from "express";
import { upload, validateUpload } from "../../../core/upload/index.js";
import { uploadOrganizationLogoController } from "./index.js";

const router = Router({ mergeParams: true });

router.patch(
  "/",
  upload.single("organization_logo"),
  validateUpload("organization_logo"),
  uploadOrganizationLogoController
);

export default router;
