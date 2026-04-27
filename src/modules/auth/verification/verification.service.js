import { ApiError } from "../../../core/utils/index.js";

import {
  sendMail,
  emailVerificationTemplate,
} from "../../../core/mail/index.js";

import {
  findUserForVerification,
  markEmailVerified,
} from "./verification.repository.js";

import { createOtpRecord, verifyOtpRecord } from "../../../core/otp/index.js";
import { OTP_PURPOSE } from "../../../core/constants/index.js";

// ! SERVICE TO SEND VERIFICATION OTP
export const sendEmailVerificationService = async userId => {
  const user = await findUserForVerification(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (user.isEmailVerified) {
    throw new ApiError(400, "Email already verified");
  }

  const otp = await createOtpRecord(userId, OTP_PURPOSE.EMAIL_VERIFY);

  await sendMail({
    to: user.email,
    subject: "Verify your email",
    html: emailVerificationTemplate(otp),
  });
};

// ! SERVICE TO CONFIRM VERIFICATION
export const confirmEmailVerificationService = async (userId, otp) => {
  await verifyOtpRecord(userId, otp, OTP_PURPOSE.EMAIL_VERIFY);

  await markEmailVerified(userId);

  return true;
};
