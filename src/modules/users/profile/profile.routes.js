import { Router } from "express";
import { validate } from "../../../core/middleware/index.js";

import avatarRoutes from "../avatar/avatar.routes.js";

import {
  getProfileController,
  updateProfileController,
  changePasswordController,
} from "./profile.controller.js";

import {
  updateProfileSchema,
  changePasswordSchema,
} from "./profile.validation.js";

const router = Router();

// ! PROFILE ROUTES
router.get("/me", getProfileController);
router.patch("/me", validate(updateProfileSchema), updateProfileController);

// ! CHANGE PASSWORD ROUTE
router.patch(
  "/change-password",
  validate(changePasswordSchema),
  changePasswordController
);

// ! AVATAR ROUTES
router.use("/avatar", avatarRoutes);

export default router;
