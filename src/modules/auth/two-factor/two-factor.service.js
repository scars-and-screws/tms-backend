import { createOtpRecord, verifyOtpRecord } from "../../../core/otp/index.js";
import { OTP_PURPOSE } from "../../../core/constants/index.js";

import { upsertTrustedDevice } from "../trusted-device/trusted-device.repository.js";
import { generateFingerprint } from "../../../core/security/index.js";

import { sendMail, twoFactorTemplate } from "../../../core/mail/index.js";
import { ApiError } from "../../../core/utils/index.js";
import { finalizeLoginService } from "../core/auth.service.js";
import {
  safeVerifyTempToken,
  safeDecodeTempToken,
} from "../shared/auth.utils.js";

import {
  findUserById,
  enableTwoFactor,
  disableTwoFactor,
} from "./two-factor.repository.js";
import { verifyTempToken } from "../../../core/security/token.js";

// ! ENABLE TWO FACTOR LOGIN SERVICE
export const enableTwoFactorLoginService = async userId => {
  const user = await findUserById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (user.twoFactorEnabled) {
    throw new ApiError(400, "Two-factor authentication is already enabled");
  }

  await enableTwoFactor(userId);
};

// ! SEND LOGIN OTP SERVICE
export const sendLoginOtpService = async user => {
  const otp = await createOtpRecord(user.id, OTP_PURPOSE.TWO_FACTOR);

  await sendMail({
    to: user.email,
    subject: "Your OTP for Two-Factor Authentication",
    html: twoFactorTemplate(otp),
  });
  return true;
};

// ! RESEND TWO FACTOR OTP SERVICE
export const resendTwoFactorOtpService = async tempToken => {
  const decoded = safeDecodeTempToken(tempToken);

  // check valid purpose
  if (decoded.purpose !== OTP_PURPOSE.TWO_FACTOR) {
    throw new ApiError(400, "Invalid request");
  }

  const user = await findUserById(decoded.userId);

  if (!user || !user.twoFactorEnabled) {
    throw new ApiError(400, "Invalid request");
  }

  await sendLoginOtpService(user);

  return true;
};

// ! DISABLE TWO FACTOR LOGIN SERVICE
export const disableTwoFactorLoginService = async userId => {
  const user = await findUserById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (!user.twoFactorEnabled) {
    throw new ApiError(400, "Two-factor authentication is not enabled");
  }

  await disableTwoFactor(userId);
};

// ! VERIFY TWO FACTOR LOGIN SERVICE
export const verifyTwoFactorLoginService = async (tempToken, otp, meta) => {
  const decoded = safeVerifyTempToken(tempToken);

  const user = await findUserById(decoded.userId);

  if (!user || !user.twoFactorEnabled) {
    throw new ApiError(400, "Invalid request");
  }

  // 1️⃣ Verify OTP
  await verifyOtpRecord(decoded.userId, otp, OTP_PURPOSE.TWO_FACTOR);

  // 2️⃣ SAVE TRUSTED DEVICE
  if (meta.rememberDevice) {
    const deviceId = meta.deviceId;
    const fingerprint = generateFingerprint(deviceId, meta.userAgent);

    await upsertTrustedDevice({
      userId: user.id,
      deviceId,
      fingerprint,
    });
  }

  // 2️⃣ Finalize login (create session and return tokens)
  return await finalizeLoginService(user, meta);
};
