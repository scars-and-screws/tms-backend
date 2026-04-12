import { z } from "zod";
import {
  idSchema,
  projectNameSchema,
  descriptionSchema,
  projectRoleSchema,
} from "../../../core/validation/index.js";

// ! CREATE PROJECT SCHEMA
export const createProjectSchema = {
  params: z
    .object({
      organizationId: idSchema,
    })
    .strict(),
  body: z
    .object({
      name: projectNameSchema,
      description: z.string().optional(),
    })
    .strict(),
};

// ! UPDATE PROJECT SCHEMA
export const updateProjectSchema = {
  params: z
    .object({
      projectId: idSchema,
    })
    .strict(),

  body: z
    .object({
      name: projectNameSchema.optional(),
      description: descriptionSchema.optional(),
    })
    .strict()
    .refine(data => data.name !== undefined || data.description !== undefined, {
      message: "At least one field must be provided for update",
    }),
};

// ! PROJECT PARAM VALIDATION SCHEMA
export const projectIdParamSchema = {
  params: z
    .object({
      projectId: idSchema,
    })
    .strict(),
};

// ! ORGANIZATION PARAM VALIDATION (FOR GETTING ALL PROJECTS IN AN ORGANIZATION)
export const organizationIdParamSchema = {
  params: z
    .object({
      organizationId: idSchema,
    })
    .strict(),
};
