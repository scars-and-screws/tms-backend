import { ApiError, asyncHandler } from "../utils/index.js";
import { findTaskByIdMinimal } from "../../modules/projects/tasks/core/task.repository.js";
import { findProjectMember } from "../../modules/projects/members/projectMember.repository.js";

// ! MIDDLEWARE TO CHECK IF USER HAS ACCESS TO THE TASK (it replaces org + project middleware)
const requireTaskAccess = asyncHandler(async (req, res, next) => {
  const { taskId } = req.params;
  const userId = req.user.id;

  // 1️⃣ Find task (minimal for performance)
  const task = await findTaskByIdMinimal(taskId);
  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  // 2️⃣ Check project membership
  const membership = await findProjectMember(task.projectId, userId);
  if (!membership) {
    throw new ApiError(403, "User does not have access to this task");
  }

  // 3️⃣ attach task adn project membership to request for reuse in controllers
  req.task = task;
  req.projectMembership = membership;
  next();
});

export default requireTaskAccess;
