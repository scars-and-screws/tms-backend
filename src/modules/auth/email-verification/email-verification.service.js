import { ApiError } from "../../../shared/errors/api-error.js";

import {
  mailService,
  emailVerificationTemplate,
} from "../../../infrastructure/mail/index.js";

import {
  findUserForVerification,
  markEmailVerified,
} from "./email-verification.repository.js";

import { createOtpRecord, verifyOtpRecord, OTP_PURPOSE } from "../otp/index.js";

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
