import multer from "multer";

const storage = multer.memoryStorage();

export const uploadService = multer({
  storage,
  limits: {
    fileSize: 15 * 1024 * 1024, // 15MB file size limit
  },
});
