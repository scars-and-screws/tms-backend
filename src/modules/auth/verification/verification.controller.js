import { ApiResponse, asyncHandler } from "../../../core/utils/index.js";
import {
  confirmEmailVerificationService,
  sendEmailVerificationService,
} from "./index.js";

// ! CONTROLLER TO SEND VERIFICATION OTP
export const sendEmailVerificationController = asyncHandler(
  async (req, res) => {
    await sendEmailVerificationService(req.user.id);
    res.json(new ApiResponse(200, null, "Verification email sent"));
  }
);

// ! CONTROLLER TO CONFIRM VERIFICATION
export const verifyEmailController = asyncHandler(async (req, res) => {
  const { otp } = req.body;
  await confirmEmailVerificationService(req.user.id, otp);
  res.json(new ApiResponse(200, null, "Email verified successfully"));
});
