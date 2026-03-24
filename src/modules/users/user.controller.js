import {
  asyncHandler,
  ApiResponse,
  buildAuthResponse,
  getRequestMeta,
} from "../../core/utils/index.js";
import {
  getProfileService,
  changePasswordService,
  updateProfileService,
} from "./index.js";
import { setRefreshTokenCookie } from "../../core/security/index.js";

// ! CONTROLLER FOR GETTING CURRENT USER PROFILE
export const getProfileController = asyncHandler(async (req, res) => {
  const user = await getProfileService(req.user.id);

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Profile fetched successfully"));
});

// ! CONTROLLER FOR UPDATING USER PROFILE
export const updateProfileController = asyncHandler(async (req, res) => {
  const updatedUser = await updateProfileService(req.user.id, req.body);
  return res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "Profile updated successfully"));
});

// ! CONTROLLER FOR CHANGING PASSWORD
export const changePasswordController = asyncHandler(async (req, res) => {
  const meta = getRequestMeta(req);
  const { user, accessToken, refreshToken } = await changePasswordService(
    req.user.id,
    req.body,
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
