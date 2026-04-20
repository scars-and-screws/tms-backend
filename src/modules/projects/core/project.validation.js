import { z } from "zod";
import {
  idSchema,
  projectNameSchema,
  descriptionSchema,
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

// ! LIST PROJECTS SCHEMA (VALIDATION FOR ORGANIZATION ID PARAM)
export const listProjectsSchema = {
  params: z
    .object({
      organizationId: idSchema,
    })
    .strict(),
};

// ! UPDATE PROJECT SCHEMA
export const updateProjectSchema = {
  params: z
    .object({
      organizationId: idSchema,
      projectId: idSchema,
    })
    .strict(),

  body: z
    .object({
      name: projectNameSchema.optional(),
      description: descriptionSchema.optional(),
    })
    .strict()
    .refine(data => data.name || data.description, {
      message: "At least one field required (name or description)",
    }),
};

// ! PROJECT PARAM VALIDATION SCHEMA
export const getProjectIdParamSchema = {
  params: z
    .object({
      organizationId: idSchema,
      projectId: idSchema,
    })
    .strict(),
};

// ! DELETE PROJECT SCHEMA
export const deleteProjectSchema = {
  params: z
    .object({
      organizationId: idSchema,
      projectId: idSchema,
    })
    .strict(),
  body: z
    .object({
      projectName: projectNameSchema,
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
