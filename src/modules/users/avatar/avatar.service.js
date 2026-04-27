import { ApiError } from "../../../core/utils/index.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../../../core/upload/index.js";

import { findUserAvatar, updateUserAvatar } from "./avatar.repository.js";

// ! UPLOAD AVATAR SERVICE
export const uploadAvatarService = async (userId, file) => {
  if (!file) {
    throw new ApiError(400, "Avatar file is required");
  }

  if (file.size === 0) {
    throw new ApiError(400, "Uploaded file is empty");
  }

  // 1️⃣ Find user and get current avatar public ID
  const user = await findUserAvatar(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // 2️⃣ Upload new avatar to Cloudinary
  const { url, publicId } = await uploadToCloudinary(file, "avatar");

  // 3️⃣ Update BATABASE with new avatar URL and public ID
  await updateUserAvatar(userId, {
    avatarUrl: url,
    avatarPublicId: publicId,
  });

  // 4️⃣ Delete old avatar from Cloudinary if it exists (non-blocking)
  if (user.avatarPublicId) {
    deleteFromCloudinary(user.avatarPublicId).catch(err => {
      console.error("Failed to delete old avatar ", err.message);
    });
  }

  return { avatarUrl: url };
};
