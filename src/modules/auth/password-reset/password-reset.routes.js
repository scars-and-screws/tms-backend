import { Router } from "express";
import { validate } from "../../../core/middleware/index.js";

import {
  requestPasswordResetSchema,
  confirmPasswordResetSchema,
} from "./password-reset.validation.js";

import {
  requestPasswordResetController,
  confirmPasswordResetController,
} from "./password-reset.controller.js";

const router = Router();

router.post(
  "/request",
  validate(requestPasswordResetSchema),
  requestPasswordResetController
);

router.post(
  "/confirm",
  validate(confirmPasswordResetSchema),
  confirmPasswordResetController
);

export default router;
