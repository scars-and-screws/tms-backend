import { z } from "zod";
import { idSchema, projectRoleSchema } from "../../../core/validation/index.js";

// ! ADD PROJECT MEMBER SCHEMA
export const addProjectMemberSchema = {
  params: z
    .object({
      organizationId: idSchema,
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

// ! LIST PROJECT MEMBERS SCHEMA (VALIDATION FOR PROJECT ID PARAM)
export const listProjectMembersSchema = {
  params: z
    .object({
      organizationId: idSchema,
      projectId: idSchema,
    })
    .strict(),
};

// ! UPDATE PROJECT MEMBER ROLE SCHEMA
export const updateProjectMemberRoleSchema = {
  params: z
    .object({
      organizationId: idSchema,
      projectId: idSchema,
      memberId: idSchema,
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
      organizationId: idSchema,
      projectId: idSchema,
      memberId: idSchema,
    })
    .strict(),
};

// ! LEAVE PROJECT SCHEMA (SELF-REMOVAL)
export const leaveProjectSchema = {
  params: z
    .object({
      organizationId: idSchema,
      projectId: idSchema,
    })
    .strict(),
};
