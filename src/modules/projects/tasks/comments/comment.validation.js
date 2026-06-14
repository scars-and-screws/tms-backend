import { z } from "zod";
import {
  commentContentSchema,
  idSchema,
} from "../../../../shared/validation/index.js";

import { paginationQuerySchema } from "../../../../shared/pagination/pagination.validation.js";

export const createCommentSchema = {
  params: z
    .object({
      organizationId: idSchema,
      projectId: idSchema,
      taskId: idSchema,
    })
    .strict(),
  body: z
    .object({
      content: commentContentSchema,
    })
    .strict(),
};

export const listCommentsSchema = {
  params: z
    .object({
      organizationId: idSchema,
      projectId: idSchema,
      taskId: idSchema,
    })
    .strict(),
  query: paginationQuerySchema,
};

export const getCommentSchema = {
  params: z
    .object({
      commentId: idSchema,
    })
    .strict(),
};

export const updateCommentSchema = {
  params: z
    .object({
      commentId: idSchema,
    })
    .strict(),
  body: z
    .object({
      content: commentContentSchema,
    })
    .strict(),
};

export const deleteCommentSchema = {
  params: z
    .object({
      commentId: idSchema,
    })
    .strict(),
};
