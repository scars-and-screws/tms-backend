import cloudinary from "./cloudinary.js";
import { UPLOAD_CONFIG } from "./upload.config.js";
import { ApiError } from "../utils/index.js";
import streamifier from "streamifier";

export const uploadToCloudinary = async (file, type) => {
  // 1️⃣ Validate upload type
  const config = UPLOAD_CONFIG[type];

  // 2️⃣ Validate file presence
  if (!config) {
    throw new ApiError(400, `Invalid upload type: ${type}`);
  }

  // 3️⃣ Validate file existence and buffer
  if (!file || !file.buffer) {
    throw new ApiError(400, "Invalid file");
  }

  // 4️⃣ Upload to Cloudinary using stream
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: config.folder,
        transformation: config.transformations || [],
        resource_type: "auto",
      },
      // Callback to handle upload result
      (error, result) => {
        if (error) return reject(new ApiError(500, "Cloud upload failed"));

        resolve({
          url: result.secure_url,
          publicId: result.public_id,

          // Store original file name and MIME type for reference
          fileName: file.originalname,
          mimeType: file.mimetype,
          size: file.size,
        });
      }
    );

    streamifier.createReadStream(file.buffer).pipe(uploadStream);
  });
};

export const deleteFromCloudinary = async publicId => {
  if (!publicId) return;

  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.error("Cloudinary deletion failed for publicId:", err.message);
  }
};
