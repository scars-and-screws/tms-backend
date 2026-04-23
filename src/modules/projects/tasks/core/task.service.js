import { ApiError } from "../../../../core/utils/index.js";
import {
  createTask,
  findTaskById,
  findTaskByIdMinimal,
  findTasksByProjectId,
  updateTask,
  deleteTask,
  assignTask,
  updateTaskStatus,
  archiveTask,
  unarchiveTask,
} from "./task.repository.js";
import { findProjectMember } from "../../members/projectMember.repository.js";
import { createActivityService } from "../../../../core/activity/activity.service.js";
import { ACTIVITY_TYPES } from "../../../../core/constants/index.js";

// ! CREATE TASK SERVICE
export const createTaskService = async (projectId, userId, data) => {
  const { title, description, priority, dueDate, assigneeId } = data;

  // 1️⃣ Check user is project member
  const membership = await findProjectMember(userId, projectId);
  if (!membership) {
    throw new ApiError(403, "User is not a member of this project");
  }

  // 2️⃣ Check assignee is also a project member if assigneeId is provided
  if (assigneeId) {
    const assigneeMembership = await findProjectMember(assigneeId, projectId);
    if (!assigneeMembership) {
      throw new ApiError(400, "Assignee must be a project member");
    }
  }

  // 3️⃣ Create task
  const task = await createTask({
    title,
    description,
    priority,
    dueDate: dueDate ? new Date(dueDate) : null,
    projectId,
    createdById: userId,
    assigneeId: assigneeId ?? null, // explicitly set to null if not provided
  });

  // 4️⃣ Log activity (non-blocking)
  createActivityService({
    actorId: userId,
    type: ACTIVITY_TYPES.TASK_CREATED,
    projectId,
    taskId: task.id,
    metadata: {
      title,
    },
  });

  return task;
};

// ! LIST TASKS SERVICE
export const listTasksService = async (projectId, filters) => {
  return findTasksByProjectId({ projectId, ...filters });
};

// ! GET TASK SERVICE
export const getTaskService = async taskId => {
  const task = await findTaskById(taskId);
  if (!task) {
    throw new ApiError(404, "Task not found");
  }
  return task;
};

// ! UPDATE TASK SERVICE
export const updateTaskService = async (taskId, userId, data) => {
  const task = await findTaskById(taskId);
  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  //  1️⃣ Check project membership
  const membership = await findProjectMember(userId, task.projectId);
  if (!membership) {
    throw new ApiError(403, "User is not a member of this project");
  }

  // 2️⃣ update task
  const updated = await updateTask(taskId, data);

  // 3️⃣ Log activity (non-blocking)
  createActivityService({
    actorId: userId,
    type: ACTIVITY_TYPES.TASK_UPDATED,
    projectId: task.projectId,
    taskId,
    metadata: {
      title: data.title || task.title,
    },
  });

  return updated;
};

// ! DELETE TASK SERVICE
export const deleteTaskService = async (taskId, userId) => {
  const task = await findTaskById(taskId);
  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  //  1️⃣ Check project membership and role (only ADMIN can delete)
  const membership = await findProjectMember(userId, task.projectId);
  if (!membership || membership.role !== "ADMIN") {
    throw new ApiError(403, "Only project admins can delete tasks");
  }
  // 2️⃣ delete task
  await deleteTask(taskId);

  // 3️⃣ Log activity (non-blocking)
  createActivityService({
    actorId: userId,
    type: ACTIVITY_TYPES.TASK_DELETED,
    projectId: task.projectId,
    taskId,
    metadata: {
      title: task.title,
    },
  });

  return true;
};

// ! ASSIGN TASK SERVICE
export const assignTaskService = async (taskId, assigneeId, userId) => {
  const task = await findTaskById(taskId);
  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  // Prevent re-assigning to the same user
  if (task.assigneeId === assigneeId) {
    throw new ApiError(400, "Task is already assigned to this user");
  }

  //  1️⃣ Check assignee is project member
  const assigneeMembership = await findProjectMember(
    assigneeId,
    task.projectId
  );
  if (!assigneeMembership) {
    throw new ApiError(400, "Assignee must be a project member");
  }

  // 2️⃣ assign task
  const updated = await assignTask(taskId, assigneeId);

  // 3️⃣ Log activity (non-blocking)
  createActivityService({
    actorId: userId,
    type: ACTIVITY_TYPES.TASK_ASSIGNED,
    projectId: task.projectId,
    taskId,
    metadata: {
      title: task.title,
      assigneeId,
    },
  });

  return updated;
};

// ! UPDATE TASK STATUS SERVICE
export const updateTaskStatusService = async (taskId, status, userId) => {
  const task = await findTaskById(taskId);
  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  //  1️⃣ update task status
  const updated = await updateTaskStatus(taskId, status);

  // 2️⃣ Log activity (non-blocking)
  createActivityService({
    actorId: userId,
    type: ACTIVITY_TYPES.TASK_STATUS_UPDATED,
    projectId: task.projectId,
    taskId,
    metadata: {
      title: task.title,
      status,
    },
  });
  return updated;
};

// ! ARCHIVE TASK SERVICE
export const archiveTaskService = async (taskId, userId) => {
  const task = await findTaskById(taskId);
  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  //  1️⃣ archive task
  await archiveTask(taskId);

  // 2️⃣ Log activity (non-blocking)
  createActivityService({
    actorId: userId,
    type: ACTIVITY_TYPES.TASK_ARCHIVED,
    projectId: task.projectId,
    taskId,
    metadata: {
      title: task.title,
    },
  });
  return true;
};

// ! UNARCHIVE TASK SERVICE
export const unarchiveTaskService = async (taskId, userId) => {
  const task = await findTaskById(taskId);
  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  //  1️⃣ unarchive task
  await unarchiveTask(taskId);

  // 2️⃣ Log activity (non-blocking)
  createActivityService({
    actorId: userId,
    type: ACTIVITY_TYPES.TASK_UNARCHIVED,
    projectId: task.projectId,
    taskId,
    metadata: {
      title: task.title,
    },
  });
  return true;
};
