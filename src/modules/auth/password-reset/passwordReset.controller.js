import { asyncHandler, ApiResponse } from "../../../core/utils/index.js";
import {
  requestPasswordResetService,
  confirmPasswordResetService,
} from "./index.js";

export const requestPasswordResetController = asyncHandler(async (req, res) => {
  const { email } = req.body;
  await requestPasswordResetService(email);
  res.json(
    new ApiResponse(
      200,
      null,
      "If this email exists, a reset code has been sent"
    )
  );
});

export const confirmPasswordResetController = asyncHandler(async (req, res) => {
  const { email, otp, newPassword } = req.body;
  await confirmPasswordResetService(email, otp, newPassword);
  res.json(new ApiResponse(200, null, "Password reset successful"));
});
