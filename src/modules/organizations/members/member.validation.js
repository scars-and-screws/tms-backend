import { z } from "zod";
import { emailSchema, idSchema } from "../../../core/validation/index.js";

// ! ADD MEMBER VALIDATION SCHEMA
export const addMemberSchema = {
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

// ! LIST MEMBERS VALIDATION SCHEMA
export const listMembersSchema = {
  params: z.object({
    organizationId: idSchema,
  }),
};

// ! UPDATE MEMBER ROLE VALIDATION SCHEMA
export const updateMemberRoleSchema = {
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

// ! REMOVE MEMBER VALIDATION SCHEMA
export const removeMemberSchema = {
  params: z.object({
    organizationId: idSchema,
    memberId: idSchema,
  }),
};
