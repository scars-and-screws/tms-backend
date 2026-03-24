import prisma from "../../../core/database/prisma.js";
import { ApiError } from "../../../core/utils/index.js";
import { sendMail, verificationTemplate } from "../../../core/mail/index.js";
import {
  createOtpRecord,
  OTP_PURPOSE,
  verifyOtpRecord,
} from "../../../core/otp/index.js";

// ! SERVICE TO SEND VERIFICATION OTP
export const sendEmailVerificationService = async id => {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      email: true,
      isEmailVerified: true,
    },
  });

  if (user.isEmailVerified) {
    throw new ApiError(400, "Email already verified");
  }
  const otp = await createOtpRecord({
    userId: user.id,
    purpose: OTP_PURPOSE.EMAIL_VERIFY,
  });

  await sendMail({
    to: user.email,
    subject: "Verify your email",
    html: verificationTemplate(otp),
  });
};

// ! SERVICE TO CONFIRM VERIFICATION
export const confirmEmailVerificationService = async (id, otp) => {
  await verifyOtpRecord({
    userId: id,
    otp,
    purpose: OTP_PURPOSE.EMAIL_VERIFY,
  });

  await prisma.user.update({
    where: {
      id,
    },
    data: {
      isEmailVerified: true,
    },
  });
  return true;
};
