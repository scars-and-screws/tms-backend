import { z } from "zod";
import {
  usernameSchema,
  nameSchema,
  bioSchema,
  headlineSchema,
  skillsSchema,
  passwordSchema,
} from "../../core/validation/index.js";

// ! UPDATE PROFILE VALIDATION SCHEMA
export const updateProfileSchema = {
  body: z
    .object({
      username: usernameSchema.optional(),
      firstName: nameSchema.optional(),
      lastName: nameSchema.optional(),
      bio: bioSchema.optional(),
      headline: headlineSchema.optional(),
      skills: skillsSchema.optional(),
    })
    .strict(),
};

// ! CHANGE PASSWORD VALIDATION SCHEMA
export const changePasswordSchema = {
  body: z
    .object({
      currentPassword: passwordSchema,
      newPassword: passwordSchema,
    })
    .strict(),
};
