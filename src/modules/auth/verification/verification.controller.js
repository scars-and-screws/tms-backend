import { ApiResponse, asyncHandler } from "../../../core/utils/index.js";
import {
  confirmEmailVerificationService,
  sendEmailVerificationService,
} from "./verification.service.js";

// ! CONTROLLER TO SEND VERIFICATION EMAIL
export const sendEmailVerificationController = asyncHandler(
  async (req, res) => {
    await sendEmailVerificationService(req.user.id);

    return res.json(
      new ApiResponse(200, null, "Verification email sent successfully")
    );
  }
);

// ! CONTROLLER TO CONFIRM VERIFICATION
export const verifyEmailController = asyncHandler(async (req, res) => {
  const { otp } = req.body;

  await confirmEmailVerificationService(req.user.id, otp);

  return res.json(new ApiResponse(200, null, "Email verified successfully"));
});
