import { asyncHandler, ApiResponse } from "../../../../core/utils/index.js";
import {
  uploadAttachmentService,
  listTaskAttachmentsService,
  deleteAttachmentService,
  listCommentAttachmentsService,
} from "./attachment.service.js";

// ! UPLOAD TASK ATTACHMENT CONTROLLER
export const uploadTaskAttachmentController = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const userId = req.user.id;
  const files = req.files;

  const attachments = await uploadAttachmentService(files, userId, taskId);
  res
    .status(201)
    .json(
      new ApiResponse(201, attachments, "Task attachment uploaded successfully")
    );
});

// ! UPLOAD COMMENT ATTACHMENT CONTROLLER
export const uploadCommentAttachmentController = asyncHandler(
  async (req, res) => {
    const { taskId, commentId } = req.params;
    const userId = req.user.id;
    const files = req.files;

    const attachments = await uploadAttachmentService(
      files,
      userId,
      taskId,
      commentId
    );
    res
      .status(201)
      .json(
        new ApiResponse(
          201,
          attachments,
          "Comment attachment uploaded successfully"
        )
      );
  }
);

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

// ! LIST COMMENT ATTACHMENTS CONTROLLER
export const listCommentAttachmentsController = asyncHandler(
  async (req, res) => {
    const { commentId } = req.params;

    const attachments = await listCommentAttachmentsService(commentId);

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          attachments,
          "Comment attachments retrieved successfully"
        )
      );
  }
);

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
