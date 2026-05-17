import { z } from "zod";

import { idSchema } from "../validation/index.js";
import { paginationQuerySchema } from "../pagination/pagination.validation.js";

// ! PROJECT ACTIVITY PARAMS VALIDATION
export const projectActivityParamsSchema = {
  params: z
    .object({
      organizationId: idSchema,
      projectId: idSchema,
    })
    .strict(),
};

// ! PROJECT ACTIVITY QUERY VALIDATION
export const projectActivityQuerySchema = {
  query: paginationQuerySchema,
};

// ! TASK ACTIVITY PARAMS VALIDATION
export const taskActivityParamsSchema = {
  params: z
    .object({
      taskId: idSchema,
    })
    .strict(),
};

// ! TASK ACTIVITY QUERY VALIDATION
export const taskActivityQuerySchema = {
  query: paginationQuerySchema,
};
