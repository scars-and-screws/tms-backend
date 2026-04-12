import { Router } from "express";
import { validate } from "../../../core/middleware/index.js";
import { avatarRoutes } from "../avatar/index.js";
import {
  getProfileController,
  updateProfileController,
  changePasswordController,
  updateProfileSchema,
  changePasswordSchema,
} from "../index.js";

const router = Router();

router.get("/me", getProfileController);
router.patch("/me", validate(updateProfileSchema), updateProfileController);

router.patch(
  "/change-password",
  validate(changePasswordSchema),
  changePasswordController
);

router.use("/avatar", avatarRoutes);

export default router;
