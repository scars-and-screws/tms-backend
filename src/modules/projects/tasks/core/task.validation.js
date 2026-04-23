import { z } from "zod";
import {
  idSchema,
  taskTitleSchema,
  taskDescriptionSchema,
  taskPrioritySchema,
  dateSchema,
  positionSchema,
  taskStatusSchema,
} from "../../../../core/validation/index.js";

// ! CREATE TASK
export const createTaskSchema = {
  params: z
    .object({
      projectId: idSchema,
    })
    .strict(),

  body: z
    .object({
      title: taskTitleSchema,
      description: taskDescriptionSchema.optional(),
      priority: taskPrioritySchema.optional(),
      dueDate: dateSchema.optional(),
      assigneeId: idSchema.optional(),
    })
    .strict(),
};

// ! UPDATE TASK
export const updateTaskSchema = {
  params: z
    .object({
      taskId: idSchema,
    })
    .strict(),

  body: z
    .object({
      title: taskTitleSchema.optional(),
      description: taskDescriptionSchema.optional(),
      priority: taskPrioritySchema.optional(),
      dueDate: dateSchema.optional(),
      position: positionSchema.optional(),
    })
    .strict(),
};

// ! ASSIGN TASK
export const assignTaskSchema = {
  params: z
    .object({
      taskId: idSchema,
    })
    .strict(),

  body: z
    .object({
      assigneeId: idSchema,
    })
    .strict(),
};

// ! UPDATE TASK STATUS
export const updateTaskStatusSchema = {
  params: z
    .object({
      taskId: idSchema,
    })
    .strict(),

  body: z
    .object({
      status: taskStatusSchema,
    })
    .strict(),
};

// ! GET TASK
export const getTaskSchema = {
  params: z
    .object({
      taskId: idSchema,
    })
    .strict(),
};

// ! DELETE TASK
export const deleteTaskSchema = {
  params: z
    .object({
      taskId: idSchema,
    })
    .strict(),
};

// ! LIST TASKS
export const listTasksSchema = {
  params: z
    .object({
      projectId: idSchema,
    })
    .strict(),

  query: z
    .object({
      status: taskStatusSchema.optional(),
      priority: taskPrioritySchema.optional(),
      assigneeId: idSchema.optional(),
    })
    .strict(),
};

// ! ARCHIVE TASK
export const archiveTaskSchema = {
  params: z
    .object({
      taskId: idSchema,
    })
    .strict(),
};

// ! UNARCHIVE TASK
export const unarchiveTaskSchema = {
  params: z
    .object({
      taskId: idSchema,
    })
    .strict(),
};
