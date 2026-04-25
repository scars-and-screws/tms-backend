import { ApiError, asyncHandler } from "../utils/index.js";

// ! CHECK IF TASK IS ACTIVE
const requireActiveTask = asyncHandler(async (req, res, next) => {
  let task = req.task;

  if (!task && req.comment) {
    // If task is not loaded, try to get it from the comment (for comment routes)
    task = req.comment.task;
  }

  if (!task) {
    throw new ApiError(400, "Task not found.");
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
