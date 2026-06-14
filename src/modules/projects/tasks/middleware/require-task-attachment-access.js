import { asyncHandler } from "../../../../shared/utils/index.js";
import { ApiError } from "../../../../shared/errors/api-error.js";
import { findFileWithTaskProject } from "../attachments/attachment.repository.js";
import { findProjectMember } from "../../members/project-members.repository.js";

const requireTaskAttachmentAccess = asyncHandler(async (req, res, next) => {
  const { fileId } = req.params;
  const userId = req.user.id;

  const file = await findFileWithTaskProject(fileId);

  if (!file) {
    throw new ApiError(404, "Task attachment not found");
  }

  const projectId = file.task?.projectId;
  if (!projectId) {
    throw new ApiError(400, "Invalid task attachment data");
  }

  const membership = await findProjectMember(userId, projectId);

  if (!membership) {
    throw new ApiError(403, "Access denied");
  }

  req.file = file;
  req.projectMembership = membership;

  next();
});

export default requireTaskAttachmentAccess;
