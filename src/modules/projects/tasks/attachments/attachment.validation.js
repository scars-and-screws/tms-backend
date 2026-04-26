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

// ! DELETE TASK ATTACHMENT PARAM VALIDATION SCHEMA
export const deleteTaskAttachmentParamSchema = {
  params: z
    .object({
      fileId: idSchema,
    })
    .strict(),
};
