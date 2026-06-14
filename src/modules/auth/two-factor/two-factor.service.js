import { createOtpRecord, verifyOtpRecord, OTP_PURPOSE } from "../otp/index.js";

import {
  upsertTrustedDevice,
  deleteTrustedDevice,
} from "../trusted-devices/trusted-devices.repository.js";
import { generateFingerprint } from "../shared/devices/device-fingerprint.js";

import { mailService } from "../../../infrastructure/mail/index.js";
import { twoFactorTemplate } from "../../../infrastructure/mail/index.js";
import { ApiError } from "../../../shared/errors/api-error.js";
import { finalizeLoginService } from "../auth/auth.service.js";
import {
  safeVerifyTempToken,
  safeDecodeTempToken,
} from "../shared/helpers/auth.helper.js";

import {
  findUserById,
  enableTwoFactor,
  disableTwoFactor,
} from "./two-factor.repository.js";
import { verifyTempToken } from "../../../infrastructure/security/token.js";

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

  await mailService({
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

  // cleanup trusted devices
  await deleteTrustedDevice(userId);
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
