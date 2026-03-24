import { setRefreshTokenCookie } from "../../../core/security/index.js";
import {
  enableTwoFactorLoginService,
  disableTwoFactorLoginService,
  verifyTwoFactorLoginService,
} from "./index.js";
import {
  ApiResponse,
  asyncHandler,
  buildAuthResponse,
  getRequestMeta,
} from "../../../core/utils/index.js";

export const enableTwoFactorLoginController = asyncHandler(async (req, res) => {
  await enableTwoFactorLoginService(req.user.id);
  res.json(new ApiResponse(200, null, "Two-factor authentication enabled"));
});

export const disableTwoFactorLoginController = asyncHandler(
  async (req, res) => {
    await disableTwoFactorLoginService(req.user.id);
    res.json(new ApiResponse(200, null, "Two-factor authentication disabled"));
  }
);

export const verifyTwoFactorLoginController = asyncHandler(async (req, res) => {
  const meta = getRequestMeta(req);
  const { userId, otp } = req.body;
  const { user, accessToken, refreshToken } = await verifyTwoFactorLoginService(
    { userId, otp, meta }
  );

  setRefreshTokenCookie(res, refreshToken);

  const authRes = buildAuthResponse(user, accessToken);
  res.json(
    new ApiResponse(200, authRes, "Two-factor authentication successful")
  );
});
