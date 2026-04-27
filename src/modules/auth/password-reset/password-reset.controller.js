import { asyncHandler, ApiResponse } from "../../../core/utils/index.js";
import {
  requestPasswordResetService,
  confirmPasswordResetService,
} from "./password-reset.service.js";

// ! REQUEST PASSWORD RESET CONTROLLER
export const requestPasswordResetController = asyncHandler(async (req, res) => {
  const { email } = req.body;

  await requestPasswordResetService(email);

  return res.json(
    new ApiResponse(
      200,
      null,
      "If this email exists, a reset code has been sent"
    )
  );
});

// ! CONFIRM PASSWORD RESET CONTROLLER
export const confirmPasswordResetController = asyncHandler(async (req, res) => {
  const { email, otp, newPassword } = req.body;

  await confirmPasswordResetService(email, otp, newPassword);

  return res.json(new ApiResponse(200, null, "Password reset successful"));
});
