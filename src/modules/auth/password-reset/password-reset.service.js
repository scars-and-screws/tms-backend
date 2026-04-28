import { hashPassword } from "../../../core/security/index.js";

import { sendMail, passwordResetTemplate } from "../../../core/mail/index.js";
import { createOtpRecord, verifyOtpRecord } from "../../../core/otp/index.js";

import { OTP_PURPOSE } from "../../../core/constants/index.js";

import {
  findUserByEmail,
  updateUserPassword,
  deleteUserSessions,
} from "./password-reset.repository.js";

// ! REQUEST PASSWORD RESET SERVICE
export const requestPasswordResetService = async email => {
  const user = await findUserByEmail(email);

  // 🔒 Prevent email enumeration
  if (!user) return;

  const otp = await createOtpRecord(
    user.id,
    OTP_PURPOSE.PASSWORD_RESET
  );

  await sendMail({
    to: email,
    subject: "Reset your password",
    html: passwordResetTemplate(otp),
  });
};

// ! CONFIRM PASSWORD RESET SERVICE
export const confirmPasswordResetService = async (email, otp, newPassword) => {
  const user = await findUserByEmail(email);

  if (!user) {
    throw new ApiError(400, "Invalid email or OTP");
  }

  // 1️⃣ Verify OTP
  await verifyOtpRecord(
    user.id,
    otp,
    OTP_PURPOSE.PASSWORD_RESET
  );

  // 2️⃣ Hash new password
  const passwordHash = await hashPassword(newPassword);

  // 3️⃣ Update password
  await updateUserPassword(user.id, passwordHash);

  // 4️⃣ Revoke all sessions (security 🔥)
  await deleteUserSessions(user.id);
};
