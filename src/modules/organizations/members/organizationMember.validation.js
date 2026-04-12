import { z } from "zod";
import { emailSchema, idSchema } from "../../../core/validation/index.js";

// ! ADD ORGANIZATION MEMBER VALIDATION SCHEMA
export const addOrganizationMemberSchema = {
  params: z.object({
    organizationId: idSchema,
  }),

  body: z
    .object({
      email: emailSchema,
      role: z.enum(["ADMIN", "MEMBER"]).default("MEMBER"),
    })
    .strict(),
};

// ! LIST ORGANIZATION MEMBERS VALIDATION SCHEMA
export const listOrganizationMembersSchema = {
  params: z.object({
    organizationId: idSchema,
  }),
};

// ! UPDATE ORGANIZATION MEMBER ROLE VALIDATION SCHEMA
export const updateOrganizationMemberRoleSchema = {
  params: z.object({
    organizationId: idSchema,
    memberId: idSchema,
  }),

  body: z
    .object({
      role: z.enum(["ADMIN", "MEMBER"]),
    })
    .strict(),
};

// ! REMOVE ORGANIZATION MEMBER VALIDATION SCHEMA
export const removeOrganizationMemberSchema = {
  params: z.object({
    organizationId: idSchema,
    memberId: idSchema,
  }),
};
