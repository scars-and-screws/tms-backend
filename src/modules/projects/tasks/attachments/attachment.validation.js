import { z } from "zod";
import { idSchema } from "../../../../core/validation/index.js";

// ! TASK ATTACHMENT PARAM VALIDATION SCHEMA
export const taskAttachmentParamSchema = {
  params: z
    .object({
      organizationId: idSchema,
      projectId: idSchema,
      taskId: idSchema,
    })
    .strict(),
};

// ! COMMENT ATTACHMENT PARAM VALIDATION SCHEMA
export const commentAttachmentParamSchema = {
  params: z
    .object({
      organizationId: idSchema,
      projectId: idSchema,
      taskId: idSchema,
      commentId: idSchema,
    })
    .strict(),
};

// ! DELETE TASK ATTACHMENT PARAM VALIDATION SCHEMA
export const deleteTaskAttachmentParamSchema = {
  params: z
    .object({
      organizationId: idSchema,
      projectId: idSchema,
      taskId: idSchema,
      fileId: idSchema,
    })
    .strict(),
};

// ! DELETE COMMENT ATTACHMENT PARAM VALIDATION SCHEMA
export const deleteCommentAttachmentParamSchema = {
  params: z
    .object({
      organizationId: idSchema,
      projectId: idSchema,
      taskId: idSchema,
      commentId: idSchema,
      fileId: idSchema,
    })
    .strict(),
};
