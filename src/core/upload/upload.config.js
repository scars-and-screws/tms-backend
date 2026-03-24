export const UPLOAD_CONFIG = {
  avatar: {
    folder: "avatars",
    maxSize: 2 * 1024 * 1024, // 2MB
    allowedMimeTypes: ["image/jpeg", "image/png", "image/webp"],
    transformations: [
      { width: 300, height: 300, crop: "fill", gravity: "face" },
      { quality: "auto" },
      { fetch_format: "auto" },
    ],
  },

  organization_logo: {
    folder: "organizations/logos",
    maxSize: 2 * 1024 * 1024, // 2MB
    allowedMimeTypes: ["image/jpeg", "image/png", "image/webp"],
    transformations: [
      { width: 500, height: 500, crop: "fit" },
      { quality: "auto" },
      { fetch_format: "auto" },
    ],
  },

  attachment: {
    folder: "attachments",
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedMimeTypes: ["application/pdf", "image/jpeg", "image/png"],
  },
};
