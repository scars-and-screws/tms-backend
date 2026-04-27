import {
  asyncHandler,
  ApiResponse,
  buildAuthResponse,
  getRequestMeta,
} from "../../../core/utils/index.js";

import {
  getProfileService,
  changePasswordService,
  updateProfileService,
} from "./profile.service.js";

import { setRefreshTokenCookie } from "../../../core/security/index.js";

// ! GET PROFILE CONTROLLER
export const getProfileController = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const user = await getProfileService(userId);

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Profile fetched successfully"));
});

// ! UPDATE PROFILE CONTROLLER
export const updateProfileController = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const data = req.body;

  const updatedUser = await updateProfileService(userId, data);

  return res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "Profile updated successfully"));
});

// ! CHANGE PASSWORD CONTROLLER
export const changePasswordController = asyncHandler(async (req, res) => {
  const meta = getRequestMeta(req);
  const userId = req.user.id;
  const data = req.body;

  const { user, accessToken, refreshToken } = await changePasswordService(
    userId,
    data,
    meta
  );

  setRefreshTokenCookie(res, refreshToken);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        buildAuthResponse(user, accessToken),
        "Password updated successfully"
      )
    );
});
