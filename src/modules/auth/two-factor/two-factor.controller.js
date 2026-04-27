import { setRefreshTokenCookie } from "../../../core/security/index.js";
import {
  enableTwoFactorLoginService,
  disableTwoFactorLoginService,
  verifyTwoFactorLoginService,
  resendTwoFactorOtpService,
} from "./two-factor.service.js";
import {
  ApiResponse,
  asyncHandler,
  buildAuthResponse,
  getRequestMeta,
} from "../../../core/utils/index.js";

// ! ENABLE TWO FACTOR LOGIN CONTROLLER
export const enableTwoFactorLoginController = asyncHandler(async (req, res) => {
  await enableTwoFactorLoginService(req.user.id);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Two-factor authentication enabled"));
});

// ! RESEND TWO FACTOR OTP CONTROLLER
export const resendTwoFactorOtpController = asyncHandler(async (req, res) => {
  const { tempToken } = req.body;

  await resendTwoFactorOtpService(tempToken);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "OTP resent successfully"));
});

// ! DISABLE TWO FACTOR LOGIN CONTROLLER
export const disableTwoFactorLoginController = asyncHandler(
  async (req, res) => {
    await disableTwoFactorLoginService(req.user.id);

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Two-factor authentication disabled"));
  }
);

// ! VERIFY TWO FACTOR LOGIN CONTROLLER
export const verifyTwoFactorLoginController = asyncHandler(async (req, res) => {
  const { tempToken, otp, rememberDevice } = req.body;

  const meta = { ...getRequestMeta(req), rememberDevice };

  const { user, accessToken, refreshToken } = await verifyTwoFactorLoginService(
    tempToken,
    otp,
    meta
  );

  setRefreshTokenCookie(res, refreshToken);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        buildAuthResponse(user, accessToken),
        "Two-factor authentication successful"
      )
    );
});
