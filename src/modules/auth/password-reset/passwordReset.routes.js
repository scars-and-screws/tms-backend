import { Router } from "express";
import { validate } from "../../../core/middleware/index.js";
import {
  requestPasswordResetSchema,
  confirmPasswordResetSchema,
  requestPasswordResetController,
  confirmPasswordResetController,
} from "./index.js";

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
