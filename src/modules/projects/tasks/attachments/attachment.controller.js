import { asyncHandler, ApiResponse } from "../../../../core/utils/index.js";
import {
  uploadAttachmentService,
  listAttachmentsService,
  deleteAttachmentService,
} from "./attachment.service.js";

// ! UPLOAD ATTACHMENT CONTROLLER
export const uploadAttachmentController = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const files = req.files;
  const userId = req.user.id;

  const attachment = await uploadAttachmentService(files, taskId, userId);
  res
    .status(201)
    .json(new ApiResponse(201, attachment, "Attachment uploaded successfully"));
});

// ! LIST ATTACHMENTS CONTROLLER
export const listAttachmentsController = asyncHandler(async (req, res) => {
  const { taskId } = req.params;

  const attachments = await listAttachmentsService(taskId);
  res
    .status(200)
    .json(
      new ApiResponse(200, attachments, "Attachments retrieved successfully")
    );
});

// ! DELETE ATTACHMENT CONTROLLER
export const deleteAttachmentController = asyncHandler(async (req, res) => {
  const { fileId } = req.params;
  const userId = req.user.id;
  const role = req.projectMembership.role;

  await deleteAttachmentService(fileId, userId, role);
  res
    .status(200)
    .json(new ApiResponse(200, null, "Attachment deleted successfully"));
});
