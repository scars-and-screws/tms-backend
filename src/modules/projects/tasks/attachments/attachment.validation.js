import { z } from "zod";
import { idSchema } from "../../../../core/validation/index.js";

// ! ATTACHMENT PARAM VALIDATION SCHEMA
export const attachmentParamSchema = {
  params: z
    .object({
      organizationId: idSchema,
      projectId: idSchema,
      taskId: idSchema,
    })
    .strict(),
};

// ! DELETE ATTACHMENT PARAM VALIDATION SCHEMA
export const deleteAttachmentParamSchema = {
  params: z
    .object({
      fileId: idSchema,
    })
    .strict(),
};
