import { UPLOAD_TYPES } from "../constants/index.js";

export const UPLOAD_CONFIG = {
  [UPLOAD_TYPES.AVATAR]: {
    folder: "users/avatars",
    maxSize: 2 * 1024 * 1024, // 2MB
    allowedMimeTypes: ["image/jpeg", "image/png", "image/webp"],
    transformations: [
      { width: 300, height: 300, crop: "fill", gravity: "face" },
      { quality: "auto" },
      { fetch_format: "auto" },
    ],
  },

  [UPLOAD_TYPES.ORGANIZATION_LOGO]: {
    folder: "organizations/logos",
    maxSize: 2 * 1024 * 1024, // 2MB
    allowedMimeTypes: ["image/jpeg", "image/png", "image/webp"],
    transformations: [
      { width: 500, height: 500, crop: "fit" },
      { quality: "auto" },
      { fetch_format: "auto" },
    ],
  },

  [UPLOAD_TYPES.ATTACHMENT]: {
    folder: "tasks/attachments",
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedMimeTypes: [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/webp",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "text/plain",
    ],
  },
};
