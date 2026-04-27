import { z } from "zod";
import {
  passwordSchema,
  emailSchema,
  otpSchema,
} from "../../../core/validation/index.js";

export const requestPasswordResetSchema = {
  body: z
    .object({
      email: emailSchema,
    })
    .strict(),
};

export const confirmPasswordResetSchema = {
  body: z
    .object({
      email: emailSchema,
      otp: otpSchema,
      newPassword: passwordSchema,
    })
    .strict(),
};
