import { z } from "zod";
import {
  emailSchema,
  usernameSchema,
  passwordSchema,
  nameSchema,
  bioSchema,
  headlineSchema,
  skillsSchema,
  idSchema,
  identifierSchema,
} from "../../../core/validation/index.js";

// REGISTER VALIDATION SCHEMA
export const registerSchema = {
  body: z
    .object({
      username: usernameSchema,
      email: emailSchema,
      password: passwordSchema,
      firstName: nameSchema,
      lastName: nameSchema,

      // Optional fields
      bio: bioSchema.optional(),
      headline: headlineSchema.optional(),
      skills: skillsSchema.optional(),
    })
    .strict(),
};

// LOGIN VALIDATION SCHEMA
export const loginSchema = {
  body: z
    .object({
      identifier: identifierSchema,
      password: passwordSchema,
    })
    .strict(),
};

// TERMINATE SESSION PARAMS VALIDATION SCHEMA
export const terminateSessionSchema = {
  params: z
    .object({
      sessionId: idSchema,
    })
    .strict(),
};
