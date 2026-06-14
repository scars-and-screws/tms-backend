import { ApiError } from "../../../../shared/errors/api-error.js";
import {
  createTask,
  findTaskById,
  findTaskByIdMinimal,
  findTasksByProjectId,
  countTasksByProject,
  updateTask,
  deleteTask,
  assignTask,
  updateTaskStatus,
  archiveTask,
  unarchiveTask,
} from "./task.repository.js";
import { findProjectMember } from "../../members/project-members.repository.js";
import {
  createActivityService,
  ACTIVITY_TYPES,
  buildChanges,
  buildTaskEntity,
} from "../../../activity/activity/index.js";
import {
  NOTIFICATION_TYPES,
  ENTITY_TYPES,
} from "../../../notifications/notification.constants.js";

import {
  getPagination,
  buildPaginationMeta,
} from "../../../../shared/pagination/pagination.utils.js";
import { getProjectAdmins } from "../../members/project-members.repository.js";
import { buildTaskUpdateData } from "./task.helper.js";
import { notify } from "./task-notification.helper.js";

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

    // ROLE BASED ASSIGNMENT: Only ADMIN can assign tasks to others, MEMBER can only assign to themselves
    if (membership.role !== "ADMIN" && assigneeId !== userId) {
      throw new ApiError(403, "You can only assign tasks to yourself");
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
    assigneeId: assigneeId ?? userId, // Default to self if no assignee provided
    assignedById: userId,
  });

  // 🔔 Create a notification for the assignee

  if (task.assigneeId !== userId) {
    await notify(
      {
        userId: task.assigneeId,
        type: NOTIFICATION_TYPES.TASK_ASSIGNED,
        title: "Task Assigned",
        message: `You were assigned to task "${task.title}"`,
        entityId: task.id,
        entityType: ENTITY_TYPES.TASK,
      },
      userId
    );
  }
  // 🔔 Notify admins (only if member created the task)
  if (membership.role !== "ADMIN") {
    // Find all admins in the project
    const admins = await getProjectAdmins(projectId);

    // Create notifications for each admin
    await Promise.all(
      admins.map(admin =>
        notify(
          {
            userId: admin.user.id,
            type: NOTIFICATION_TYPES.TASK_CREATED,
            title: "New Task Created",
            message: `A new task "${task.title}" was created`,
            entityId: task.id,
            entityType: ENTITY_TYPES.TASK,
          },
          userId
        )
      )
    );
  }

  // 4️⃣ Log activity (non-blocking)
  createActivityService({
    actorId: userId,

    type: ACTIVITY_TYPES.TASK_CREATED,

    organizationId: task.project.organizationId,

    projectId,

    taskId: task.id,

    entity: buildTaskEntity(task),

    extra: {
      priority,

      dueDate,

      assigneeId: task.assigneeId,
    },
  });

  return task;
};

// ! LIST TASKS SERVICE
export const listTasksService = async (projectId, query) => {
  // 1️⃣ Normalize
  const pagination = getPagination(query);

  // 2️⃣ Query
  const [tasks, total] = await Promise.all([
    findTasksByProjectId({
      projectId,
      ...query,
      skip: pagination.skip,
      limit: pagination.limit,
    }),

    countTasksByProject({
      projectId,
      ...query,
    }),
  ]);

  // 3️⃣ Return
  return {
    tasks,

    pagination: buildPaginationMeta({
      total,
      page: pagination.page,
      limit: pagination.limit,
    }),
  };
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

  // 2️⃣ Prevent protected fields from being updated
  const updateData = buildTaskUpdateData(data);

  // 3️⃣ Prevent empty update
  if (Object.keys(updateData).length === 0) {
    throw new ApiError(400, "No fields to update");
  }
  // 4️⃣ update task
  const updated = await updateTask(taskId, updateData);

  // 5️⃣ Build activity changes
  const changes = buildChanges(task, updated);

  // 6️⃣ Log activity (non-blocking)
  createActivityService({
    actorId: userId,

    type: ACTIVITY_TYPES.TASK_UPDATED,

    organizationId: task.project.organizationId,

    projectId: task.projectId,

    taskId,

    entity: buildTaskEntity(task),

    changes,
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

    organizationId: task.project.organizationId,

    projectId: task.projectId,

    taskId,

    entity: buildTaskEntity(task),
  });

  return true;
};

// ! ASSIGN TASK SERVICE
export const assignTaskService = async (taskId, assigneeId, userId) => {
  const task = await findTaskById(taskId);
  if (!task) {
    throw new ApiError(404, "Task not found");
  }
  // Get actor membership
  const membership = await findProjectMember(userId, task.projectId);
  if (!membership) {
    throw new ApiError(403, "User is not a member of this project");
  }

  // ROLE-BASED ASSIGNMENT: Only ADMIN can assign tasks to others, MEMBER can only assign to themselves
  if (membership.role !== "ADMIN" && assigneeId !== userId) {
    throw new ApiError(403, "You can only assign tasks to yourself");
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
  const updated = await assignTask(taskId, assigneeId, userId);

  // 🔔 Create a notification for the new assignee

  if (assigneeId !== userId) {
    await notify(
      {
        userId: assigneeId,
        type: NOTIFICATION_TYPES.TASK_ASSIGNED,
        title: "Task Assigned",
        message: `Task "${task.title}" was assigned to you`,
        entityId: task.id,
        entityType: ENTITY_TYPES.TASK,
      },
      userId
    );
  }
  // 🔔 Notify previous assignee if exists and different from new assignee
  if (
    task.assigneeId &&
    task.assigneeId !== assigneeId &&
    task.assigneeId !== userId
  ) {
    await notify(
      {
        userId: task.assigneeId,
        type: NOTIFICATION_TYPES.TASK_UNASSIGNED,
        title: "Task Unassigned",
        message: `You were removed from task "${task.title}"`,
        entityId: task.id,
        entityType: ENTITY_TYPES.TASK,
      },
      userId
    );
  }

  // 3️⃣ Log activity (non-blocking)
  createActivityService({
    actorId: userId,

    type: ACTIVITY_TYPES.TASK_ASSIGNED,

    organizationId: task.project.organizationId,

    projectId: task.projectId,

    taskId,

    entity: buildTaskEntity(task),

    changes: buildChanges(
      {
        assigneeId: task.assigneeId,
      },

      {
        assigneeId,
      }
    ),
  });

  return updated;
};

// ! UPDATE TASK STATUS SERVICE
export const updateTaskStatusService = async (taskId, status, userId) => {
  const task = await findTaskById(taskId);
  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  //  1️⃣ Check project membership
  const membership = await findProjectMember(userId, task.projectId);

  if (!membership) {
    throw new ApiError(403, "User is not a member of this project");
  }

  //  2️⃣ update task status
  const updated = await updateTaskStatus(taskId, status);

  // 🔔 Send notification if status is DONE
  if (task.status !== "DONE" && status === "DONE") {
    // Only notify if the user updating the status is not the creator (to avoid self-notifications)
    if (task.createdById !== userId) {
      await notify(
        {
          userId: task.createdById,
          type: NOTIFICATION_TYPES.TASK_COMPLETED,
          title: "Task Completed",
          message: `"${task.title}" has been completed`,
          entityId: task.id,
          entityType: ENTITY_TYPES.TASK,
        },
        userId
      );
    }

    if (
      task.assignedById &&
      task.assignedById !== task.createdById &&
      task.assignedById !== userId
    ) {
      await notify(
        {
          userId: task.assignedById,
          type: NOTIFICATION_TYPES.TASK_COMPLETED,
          title: "Task Completed",
          message: `"${task.title}" has been completed`,
          entityId: task.id,
          entityType: ENTITY_TYPES.TASK,
        },
        userId
      );
    }

    // If assignee !== updater
    if (task.assigneeId && task.assigneeId !== userId) {
      await notify(
        {
          userId: task.assigneeId,
          type: NOTIFICATION_TYPES.TASK_COMPLETED,
          title: "Task Completed",
          message: `"${task.title}" was marked as completed`,
          entityId: task.id,
          entityType: ENTITY_TYPES.TASK,
        },
        userId
      );
    }
  }
  // 3️⃣ Log activity (non-blocking)
  createActivityService({
    actorId: userId,

    type: ACTIVITY_TYPES.TASK_STATUS_CHANGED,

    organizationId: task.project.organizationId,

    projectId: task.projectId,

    taskId,

    entity: buildTaskEntity(task),

    changes: buildChanges(
      {
        status: task.status,
      },

      {
        status,
      }
    ),
  });

  return updated;
};

// ! ARCHIVE TASK SERVICE
export const archiveTaskService = async (taskId, userId) => {
  const task = await findTaskById(taskId);
  if (!task) {
    throw new ApiError(404, "Task not found");
  }
  // 1️⃣ Check project membership
  const membership = await findProjectMember(userId, task.projectId);

  if (!membership) {
    throw new ApiError(403, "User is not a member of this project");
  }

  // 2️⃣ Archive is admin-only action
  if (membership.role !== "ADMIN") {
    throw new ApiError(403, "Only project admins can archive tasks");
  }

  // 3️⃣ Prevent archiving an already archived task
  if (task.isArchived) {
    throw new ApiError(400, "Task is already archived");
  }

  //  4️⃣ archive task
  await archiveTask(taskId);

  // 5️⃣ Log activity (non-blocking)
  createActivityService({
    actorId: userId,

    type: ACTIVITY_TYPES.TASK_ARCHIVED,

    organizationId: task.project.organizationId,

    projectId: task.projectId,

    taskId,

    entity: buildTaskEntity(task),

    changes: buildChanges(
      {
        isArchived: false,
      },

      {
        isArchived: true,
      }
    ),
  });

  return true;
};

// ! UNARCHIVE TASK SERVICE
export const unarchiveTaskService = async (taskId, userId) => {
  const task = await findTaskById(taskId);
  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  //  1️⃣ Check project membership
  const membership = await findProjectMember(userId, task.projectId);

  if (!membership) {
    throw new ApiError(403, "User is not a member of this project");
  }

  // 2️⃣ Archive is admin-only action
  if (membership.role !== "ADMIN") {
    throw new ApiError(403, "Only project admins can unarchive tasks");
  }

  // 3️⃣ Prevent unarchiving an active task
  if (!task.isArchived) {
    throw new ApiError(400, "Task is not archived");
  }

  // 4️⃣ unarchive task
  await unarchiveTask(taskId);

  // 5️⃣ Log activity (non-blocking)
  createActivityService({
    actorId: userId,

    type: ACTIVITY_TYPES.TASK_UNARCHIVED,

    organizationId: task.project.organizationId,

    projectId: task.projectId,

    taskId,

    entity: buildTaskEntity(task),

    changes: buildChanges(
      {
        isArchived: true,
      },

      {
        isArchived: false,
      }
    ),
  });
  return true;
};
