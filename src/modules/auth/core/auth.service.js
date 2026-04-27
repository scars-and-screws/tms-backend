import {
  hashPassword,
  comparePassword,
  generateTempToken,
  generateFingerprint,
} from "../../../core/security/index.js";

import { findTrustedDevice } from "../trusted-device/trusted-device.repository.js";

import { ApiError } from "../../../core/utils/index.js";

import {
  findUserByIdentifier,
  findUserByEmailOrUsername,
  createUser,
} from "./auth.repository.js";

import { sendLoginOtpService } from "../two-factor/two-factor.service.js";

import { createSessionService } from "../session/session.service.js";
import { sendEmailVerificationService } from "../verification/verification.service.js";

// ! REGISTER SERVICE
export const registerService = async (data, meta) => {
  const {
    username,
    email,
    password,
    firstName,
    lastName,
    bio,
    headline,
    skills,
  } = data;

  // * 1️⃣ Check if user already exists
  const existing = await findUserByEmailOrUsername(email, username);

  if (existing) {
    throw new ApiError(409, "User with this email or username already exists");
  }

  // * 2️⃣ Hash the password
  const passwordHash = await hashPassword(password);

  // * 3️⃣ Create the user
  const user = await createUser({
    username,
    email,
    passwordHash,
    firstName,
    lastName,
    bio,
    headline,
    skills: skills || [],
  });

  const { accessToken, refreshToken } = await createSessionService(user, meta);

  // * 6️⃣ Send verification mail (non-blocking)
  try {
    await sendEmailVerificationService(user.id);
  } catch (err) {
    console.error("Failed to send verification email:", err.message);
  }

  return { user, accessToken, refreshToken };
};

// ! LOGIN SERVICE
export const loginService = async ({ identifier, password }, meta) => {
  // * 1️⃣ Find user by email OR username

  const user = await findUserByIdentifier(identifier);

  if (!user) throw new ApiError(401, "Invalid credentials");

  // * 2️⃣ Compare password
  const isValid = await comparePassword(password, user.passwordHash);

  if (!isValid) {
    throw new ApiError(401, "Invalid credentials");
  }
  // * 3️⃣ Check if device is trusted
  const deviceId = meta.deviceId;
  const fingerprint = generateFingerprint(deviceId, meta.userAgent);

  const trustedDevice = await findTrustedDevice(user.id, deviceId);

  if (trustedDevice && trustedDevice.fingerprint === fingerprint) {
    //  DEVICE IS TRUSTED, SKIP 2FA AND LOGIN DIRECTLY
    return finalizeLoginService(user, meta);
  }

  // * 4️⃣ Check 2FA
  if (user.twoFactorEnabled) {
    await sendLoginOtpService(user);

    const tempToken = generateTempToken({
      userId: user.id,
      purpose: "TWO_FACTOR",
    });

    return { require2FA: true, tempToken };
  }

  // * 4️⃣ Finalize login (create session and return tokens)
  return finalizeLoginService(user, meta);
};

// ! FINALIZE LOGIN SERVICE
export const finalizeLoginService = async (user, meta) => {
  const { accessToken, refreshToken } = await createSessionService(user, meta);
  return { user, accessToken, refreshToken };
};
