import { Router } from "express";
import { validate } from "../../../core/middleware/index.js";
import { verifyOtpSchema } from "../../../core/otp/index.js";
import {
  sendEmailVerificationController,
  verifyEmailController,
} from "./index.js";

const router = Router();

router.post("/send", sendEmailVerificationController);
router.post("/verify", validate(verifyOtpSchema), verifyEmailController);

export default router;
