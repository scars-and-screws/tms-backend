import { UPLOAD_CONFIG } from "./upload.config.js";
import { ApiError } from "../utils/index.js";

export const validateUpload = type => {
  const config = UPLOAD_CONFIG[type];

  if (!config) {
    throw new ApiError(400, `Invalid upload type: ${type}`);
  }

  return (req, res, next) => {
    const file = req.file;

    if (!file) {
      return next(new ApiError(400, "No file uploaded"));
    }

    if (!config.allowedMimeTypes.includes(file.mimetype)) {
      return next(
        new ApiError(
          400,
          `Invalid file type. Allowed types: ${config.allowedMimeTypes.join(
            ", "
          )}`
        )
      );
    }

    if (file.size > config.maxSize) {
      return next(
        new ApiError(
          400,
          `File size exceeds ${config.maxSize / (1024 * 1024)}MB`
        )
      );
    }
    next();
  };
};
