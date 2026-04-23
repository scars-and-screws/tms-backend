import { ApiResponse, asyncHandler } from "../../../../core/utils/index.js";
import {
  createTaskService,
  listTasksService,
  getTaskService,
  updateTaskService,
  deleteTaskService,
  assignTaskService,
  updateTaskStatusService,
  archiveTaskService,
  unarchiveTaskService,
} from "./task.service.js";

// ! CREATE TASK CONTROLLER
export const createTaskController = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const userId = req.user.id;
  const data = req.body;

  const task = await createTaskService(projectId, userId, data);

  return res
    .status(201)
    .json(new ApiResponse(201, task, "Task created successfully"));
});

// ! LIST TASKS CONTROLLER
export const listTasksController = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const filters = req.query;

  const tasks = await listTasksService(projectId, filters);

  return res
    .status(200)
    .json(new ApiResponse(200, tasks, "Tasks retrieved successfully"));
});

// ! GET TASK CONTROLLER
export const getTaskController = asyncHandler(async (req, res) => {
  const { taskId } = req.params;

  const task = await getTaskService(taskId);

  return res
    .status(200)
    .json(new ApiResponse(200, task, "Task retrieved successfully"));
});

// ! UPDATE TASK CONTROLLER
export const updateTaskController = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const userId = req.user.id;
  const data = req.body;

  const updated = await updateTaskService(taskId, userId, data);

  return res
    .status(200)
    .json(new ApiResponse(200, updated, "Task updated successfully"));
});

// ! DELETE TASK CONTROLLER
export const deleteTaskController = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const userId = req.user.id;

  await deleteTaskService(taskId, userId);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Task deleted successfully"));
});

// ! ASSIGN TASK CONTROLLER
export const assignTaskController = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const { assigneeId } = req.body;
  const userId = req.user.id;

  const updated = await assignTaskService(taskId, assigneeId, userId);

  return res
    .status(200)
    .json(new ApiResponse(200, updated, "Task assigned successfully"));
});

// ! UPDATE TASK STATUS CONTROLLER
export const updateTaskStatusController = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const { status } = req.body;
  const userId = req.user.id;

  const updated = await updateTaskStatusService(taskId, status, userId);

  return res
    .status(200)
    .json(new ApiResponse(200, updated, "Task status updated successfully"));
});

// ! ARCHIVE TASK CONTROLLER
export const archiveTaskController = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const userId = req.user.id;

  await archiveTaskService(taskId, userId);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Task archived successfully"));
});

// ! UNARCHIVE TASK CONTROLLER
export const unarchiveTaskController = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const userId = req.user.id;

  await unarchiveTaskService(taskId, userId);
  return res
    .status(200)
    .json(new ApiResponse(200, null, "Task unarchived successfully"));
});
