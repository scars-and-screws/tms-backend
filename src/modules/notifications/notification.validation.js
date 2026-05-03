import z from "zod";
import { idSchema } from "../../core/validation/index.js";
// ! NOTIFICATION ID PARAM VALIDATION SCHEMA

export const notificationIdParamSchema = {
  params: z
    .object({
      notificationId: idSchema,
    })
    .strict(),
};
