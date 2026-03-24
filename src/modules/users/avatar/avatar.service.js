import prisma from "../../../core/database/prisma.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../../../core/upload/index.js";

export const uploadAvatarService = async (userId, file) => {
  if (!file) {
    throw new ApiError(400, "Avatar file is required");
  }

  // 1️⃣ Find user and get current avatar public ID
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { avatarPublicId: true },
  });

  // 2️⃣ Upload new avatar to Cloudinary
  const { url, publicId } = await uploadToCloudinary(file, "avatar");

  // 3️⃣ Update user's avatar information in the database
  await prisma.user.update({
    where: { id: userId },
    data: {
      avatarUrl: url,
      avatarPublicId: publicId,
    },
  });

  // 4️⃣ Delete old avatar from Cloudinary if it exists
  if (user?.avatarPublicId) {
    try {
      await deleteFromCloudinary(user.avatarPublicId);
    } catch (err) {
      console.error("Error deleting old avatar from Cloudinary:", err.message);
    }
  }
  return { avatarUrl: url };
};
