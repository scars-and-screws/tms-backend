import { ApiError, asyncHandler } from "../utils/index.js";

// ! CHECK IF TASK IS ACTIVE
const requireActiveTask = asyncHandler(async (req, res, next) => {
  const task = req.task;

  if (!task) {
    throw new ApiError(500, "Task not loaded.");
  }

  if (task.isArchived) {
    throw new ApiError(
      403,
      "This task is archived. Unarchive to perform this action."
    );
  }

  next();
});

export default requireActiveTask;
