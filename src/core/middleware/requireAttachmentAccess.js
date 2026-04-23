import { ApiError, asyncHandler } from "../utils/index.js";
import { findFileWithTaskProject } from "../../modules/projects/tasks/attachments/attachment.repository.js";
import { findProjectMember } from "../../modules/projects/members/projectMember.repository.js";

const requireAttachmentAccess = asyncHandler(async (req, res, next) => {
  const { fileId } = req.params;
  const userId = req.user.id;

  const file = await findFileWithTaskProject(fileId);

  if (!file) {
    throw new ApiError(404, "Attachment not found");
  }

  const projectId = file.task?.projectId;
  if (!projectId) {
    throw new ApiError(400, "Invalid attachment data");
  }

  const membership = await findProjectMember(userId, projectId);

  if (!membership) {
    throw new ApiError(403, "Access denied");
  }

  req.file = file;
  req.projectMembership = membership;

  next();
});

export default requireAttachmentAccess;
