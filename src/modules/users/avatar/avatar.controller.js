import { ApiResponse, asyncHandler } from "../../../core/utils/index.js";
import { uploadAvatarService } from "./avatar.service.js";

// ! UPLOAD AVATAR CONTROLLER
export const uploadAvatarController = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const file = req.file;

  const result = await uploadAvatarService(userId, file);

  return res
    .status(200)
    .json(new ApiResponse(200, result, "Avatar uploaded successfully"));
});
