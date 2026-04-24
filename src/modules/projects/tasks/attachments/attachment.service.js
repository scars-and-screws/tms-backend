import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../../../../core/upload/index.js";
import { ApiError } from "../../../../core/utils/index.js";
import {
  createFile,
  findFilesByTaskId,
  findFileById,
  deleteFile,
} from "./attachment.repository.js";

// ! UPLOAD ATTACHMENT SERVICE
export const uploadAttachmentService = async (files, taskId, userId) => {
  if (!files || files.length === 0) {
    throw new ApiError(400, "At least one attachment file is required");
  }

  let uploadedFiles;

  try {
    uploadedFiles = await Promise.all(
      files.map(file => uploadToCloudinary(file, "attachment"))
    );
  } catch (err) {
    throw new ApiError(500, "Error occurred while uploading attachments");
  }

  return Promise.all(
    uploadedFiles.map(uploaded => {
      return createFile({
        fileName: uploaded.fileName,
        fileUrl: uploaded.url,
        filePublicId: uploaded.publicId,
        mimeType: uploaded.mimeType,
        size: uploaded.size,
        uploadedById: userId,
        taskId,
      });
    })
  );
};

// ! LIST ATTACHMENTS SERVICE
export const listAttachmentsService = async taskId => {
  return findFilesByTaskId(taskId);
};

// ! DELETE ATTACHMENT SERVICE
export const deleteAttachmentService = async (fileId, userId, role) => {
  const file = await findFileById(fileId);
  if (!file) {
    throw new ApiError(404, "Attachment not found");
  }

  // permission check: only uploader or admin can delete
  if (file.uploadedById !== userId && role !== "ADMIN") {
    throw new ApiError(
      403,
      "You do not have permission to delete this attachment"
    );
  }

  await deleteFromCloudinary(file.filePublicId);
  await deleteFile(fileId);

  return true;
};
