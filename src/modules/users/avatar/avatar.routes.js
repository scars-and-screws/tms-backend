import { Router } from "express";
import { upload, validateUpload } from "../../../core/upload/index.js";
import { uploadAvatarController } from "./index.js";

const router = Router();

router.patch(
  "/",
  upload.single("avatar"),
  validateUpload("avatar"),
  uploadAvatarController
);

export default router;
