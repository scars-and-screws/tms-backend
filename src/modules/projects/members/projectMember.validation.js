import { z } from "zod";
import { idSchema, projectRoleSchema } from "../../../core/validation/index.js";

// ! ADD PROJECT MEMBER SCHEMA
export const addProjectMemberSchema = {
  params: z
    .object({
      projectId: idSchema,
    })
    .strict(),
  body: z
    .object({
      userId: idSchema,
      role: projectRoleSchema.default("MEMBER"),
    })
    .strict(),
};

// ! UPDATE PROJECT MEMBER ROLE SCHEMA
export const updateProjectMemberRoleSchema = {
  params: z
    .object({
      projectId: idSchema,
      userId: idSchema,
    })
    .strict(),
  body: z
    .object({
      role: projectRoleSchema,
    })
    .strict(),
};

// ! REMOVE PROJECT MEMBER SCHEMA
export const removeProjectMemberSchema = {
  params: z
    .object({
      projectId: idSchema,
      userId: idSchema,
    })
    .strict(),
};

// ! LEAVE PROJECT SCHEMA (SELF-REMOVAL)
export const leaveProjectSchema = {
  params: z
    .object({
      projectId: idSchema,
    })
    .strict(),
};
