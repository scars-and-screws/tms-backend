import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../../../../infrastructure/storage/upload.service.js";

import { ApiError } from "../../../../shared/errors/api-error.js";
import {
  createFile,
  findFilesByTaskId,
  countTaskFiles,
  findFileById,
  deleteFile,
  findFilesByCommentId,
} from "./attachment.repository.js";

import {
  getPagination,
  buildPaginationMeta,
} from "../../../../shared/pagination/pagination.utils.js";

// ! UPLOAD  TASK ATTACHMENT SERVICE
export const uploadAttachmentService = async (
  files,
  userId,
  taskId,
  commentId
) => {
  if (!files || files.length === 0) {
    throw new ApiError(400, "At least one task attachment file is required");
  }

  let uploadedFiles;

  try {
    uploadedFiles = await Promise.all(
      files.map(file => uploadToCloudinary(file, "attachment"))
    );
  } catch (err) {
    throw new ApiError(500, "Error uploading attachments");
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
        taskId: commentId ? null : taskId,
        commentId: commentId || null,
      });
    })
  );
};

// ! LIST TASK ATTACHMENTS SERVICE
export const listTaskAttachmentsService = async (taskId, query) => {
  const pagination = getPagination(query);

  const [files, total] = await Promise.all([
    findFilesByTaskId({
      taskId,
      skip: pagination.skip,
      limit: pagination.limit,
    }),

    countTaskFiles(taskId),
  ]);

  return {
    attachments: files,

    pagination: buildPaginationMeta({
      total,
      page: pagination.page,
      limit: pagination.limit,
    }),
  };
};

// ! LIST COMMENT ATTACHMENTS SERVICE
export const listCommentAttachmentsService = async commentId => {
  return findFilesByCommentId(commentId);
};

// ! DELETE ATTACHMENT SERVICE
export const deleteAttachmentService = async (fileId, userId, role) => {
  const file = await findFileById(fileId);
  if (!file) {
    throw new ApiError(404, "'Attachment not found'");
  }

  // permission check: only uploader or admin can delete
  if (file.uploadedById !== userId && role !== "ADMIN") {
    throw new ApiError(
      403,
      "You do not have permission to delete this task attachment"
    );
  }

  await deleteFromCloudinary(file.filePublicId);
  await deleteFile(fileId);

  return true;
};
