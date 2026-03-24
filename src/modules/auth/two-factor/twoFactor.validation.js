import { z } from "zod";
import { otpSchema, idSchema } from "../../../core/validation/index.js";

export const verifyTwoFactorLoginSchema = {
  body: z
    .object({
      userId: idSchema,
      otp: otpSchema,
    })
    .strict(),
};
