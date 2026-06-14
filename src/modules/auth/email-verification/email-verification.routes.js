import { Router } from "express";
import { validate } from "../../../shared/middleware/index.js";
import { verifyOtpSchema } from "../otp/index.js";
import {
  sendEmailVerificationController,
  verifyEmailController,
} from "./email-verification.controller.js";

const router = Router();

router.post("/send", sendEmailVerificationController);
router.post("/verify", validate(verifyOtpSchema), verifyEmailController);

export default router;
