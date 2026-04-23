import { UPLOAD_CONFIG } from "./upload.config.js";
import { ApiError } from "../utils/index.js";

export const validateUpload = type => {
  const config = UPLOAD_CONFIG[type];

  if (!config) {
    throw new ApiError(400, `Invalid upload type: ${type}`);
  }

  return (req, res, next) => {
    // normalize files to an array for easier processing
    const files = req.files ? req.files : req.file ? [req.file] : [];

    if (!files || files.length === 0) {
      return next(new ApiError(400, "No files uploaded"));
    }

    for (const file of files) {
      // normalize mimetype to lowercase for case-insensitive comparison
      const mimeType = file.mimetype.toLowerCase();

      // filename length check
      if (file.originalname.length > 100) {
        return next(
          new ApiError(
            400,
            "File name is too long. Maximum length is 100 characters"
          )
        );
      }

      // validate mimetype against allowed types for this upload type
      if (!config.allowedMimeTypes.includes(mimeType)) {
        return next(
          new ApiError(
            400,
            `Invalid file type. Allowed types: ${config.allowedMimeTypes.join(
              ", "
            )}`
          )
        );
      }

      // validate file size against max size for this upload type
      if (file.size > config.maxSize) {
        return next(
          new ApiError(
            400,
            `File size exceeds ${config.maxSize / (1024 * 1024)}MB`
          )
        );
      }
    }
    next();
  };
};
