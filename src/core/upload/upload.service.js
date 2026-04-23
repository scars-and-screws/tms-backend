import cloudinary from "./cloudinary.js";
import { UPLOAD_CONFIG } from "./upload.config.js";
import streamifier from "streamifier";

export const uploadToCloudinary = async (file, type) => {
  const config = UPLOAD_CONFIG[type];

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: config.folder, transformation: config.transformations || [] },
      (error, result) => {
        if (error) return reject(error);

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

  await cloudinary.uploader.destroy(publicId);
};
