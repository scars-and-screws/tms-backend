import prisma from "../../../core/database/prisma.js";
import { hashPassword } from "../../../core/security/index.js";
import { sendMail, verificationTemplate } from "../../../core/mail/index.js";
import {
  createOtpRecord,
  OTP_PURPOSE,
  verifyOtpRecord,
} from "../../../core/otp/index.js";

export const requestPasswordResetService = async email => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return; // Silently fail to prevent email enumeration

  const otp = await createOtpRecord({
    userId: user.id,
    purpose: OTP_PURPOSE.PASSWORD_RESET,
  });

  await sendMail({
    to: email,
    subject: "Reset your password",
    html: verificationTemplate(otp),
  });
};

export const confirmPasswordResetService = async (email, otp, newPassword) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error("Invalid email or OTP");
  }
  await verifyOtpRecord({
    userId: user.id,
    otp,
    purpose: OTP_PURPOSE.PASSWORD_RESET,
  });

  const passwordHash = await hashPassword(newPassword);
  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash },
  });

  // revoke all sessions after password reset
  await prisma.refreshToken.deleteMany({
    where: { userId: user.id },
  });
};
