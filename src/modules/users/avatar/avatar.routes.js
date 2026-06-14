import { Router } from "express";
import {
  uploadService,
  validateUpload,
} from "../../../infrastructure/storage/index.js";
import { uploadAvatarController } from "./avatar.controller.js";

const router = Router();

router.patch(
  "/",
  uploadService.single("avatar"),
  validateUpload("avatar"),
  uploadAvatarController
);

export default router;
