import z from "zod";
import { idSchema } from "../../core/validation/index.js";
import { paginationQuerySchema } from "../../core/pagination/pagination.validation.js";

// ! NOTIFICATION ID PARAM VALIDATION SCHEMA
export const notificationIdParamSchema = {
  params: z
    .object({
      notificationId: idSchema,
    })
    .strict(),
};

// ! LIST NOTIFICATIONS QUERY VALIDATION
export const listNotificationsQuerySchema = {
  query: paginationQuerySchema,
};
