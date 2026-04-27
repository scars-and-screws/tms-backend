import { z } from "zod";
import { otpSchema } from "../validation/index.js";

// ! ZOD SCHEMA TO VALIDATE THE REQUEST BODY FOR VERIFYING AN OTP
const verifyOtpSchema = {
  body: z
    .object({
      otp: otpSchema,
    })
    .strict(),
};

export default verifyOtpSchema;
