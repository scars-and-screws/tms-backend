import { asyncHandler, ApiResponse } from "../../../../core/utils/index.js";
import {
  uploadTaskAttachmentService,
  listTaskAttachmentsService,
  deleteTaskAttachmentService,
} from "./attachment.service.js";

// ! UPLOAD TASK ATTACHMENT CONTROLLER
export const uploadTaskAttachmentController = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const files = req.files;
  const userId = req.user.id;

  const attachment = await uploadTaskAttachmentService(files, taskId, userId);
  res
    .status(201)
    .json(
      new ApiResponse(201, attachment, "Task attachment uploaded successfully")
    );
});

// ! LIST TASK ATTACHMENTS CONTROLLER
export const listTaskAttachmentsController = asyncHandler(async (req, res) => {
  const { taskId } = req.params;

  const attachments = await listTaskAttachmentsService(taskId);
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        attachments,
        "Task attachments retrieved successfully"
      )
    );
});

// ! DELETE TASK ATTACHMENT CONTROLLER
export const deleteTaskAttachmentController = asyncHandler(async (req, res) => {
  const { fileId } = req.params;
  const userId = req.user.id;
  const role = req.projectMembership.role;

  await deleteTaskAttachmentService(fileId, userId, role);
  res
    .status(200)
    .json(new ApiResponse(200, null, "Task attachment deleted successfully"));
});
