import { z } from "zod";
import {
  organizationNameSchema,
  descriptionSchema,
  idSchema,
} from "../../../core/validation/index.js";

// ! CREATE ORGANIZATION VALIDATION SCHEMA
export const createOrganizationSchema = {
  body: z
    .object({
      name: organizationNameSchema,
      description: descriptionSchema.optional(),
    })
    .strict(),
};

// ! UPDATE ORGANIZATION VALIDATION SCHEMA
export const updateOrganizationSchema = {
  body: z
    .object({
      name: organizationNameSchema.optional(),
      description: descriptionSchema.optional(),
    })
    .strict(),
  params: z.object({
    organizationId: idSchema,
  }),
};

// ! ORGANIZATION ID PARAM VALIDATION SCHEMA
export const organizationIdParamSchema = {
  params: z.object({
    organizationId: idSchema,
  }),
};

// ! TRANSFER ORGANIZATION OWNERSHIP VALIDATION SCHEMA
export const transferOrganizationOwnershipSchema = {
  params: z.object({
    organizationId: idSchema,
  }),

  body: z
    .object({
      newOwnerId: idSchema,
    })
    .strict(),
};

// ! LEAVE ORGANIZATION VALIDATION SCHEMA
export const leaveOrganizationSchema = {
  params: z.object({ organizationId: idSchema }),
};

// ! DELETE ORGANIZATION VALIDATION SCHEMA
export const deleteOrganizationSchema = {
  params: z.object({ organizationId: idSchema }),
  body: z
    .object({
      organizationName: organizationNameSchema,
    })
    .strict(),
};
