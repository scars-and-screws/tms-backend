import { z } from "zod";
import { otpSchema, idSchema } from "../../../core/validation/index.js";

export const verifyTwoFactorLoginSchema = {
  body: z
    .object({
      tempToken: z.string().min(1, "Temporary token is required"),
      otp: otpSchema,
      rememberDevice: z.boolean().optional(),
    })
    .strict(),
};

export const resendTwoFactorOtpSchema = {
  body: z
    .object({
      tempToken: z.string().min(1, "Temporary token is required"),
    })
    .strict(),
};
