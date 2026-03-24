import { z } from "zod";
import { otpSchema } from "../validation/index.js";

const verifyOtpSchema = {
  body: z
    .object({
      otp: otpSchema,
    })
    .strict(),
};

export default verifyOtpSchema;
