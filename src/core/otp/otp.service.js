import crypto from "crypto";
import prisma from "../database/prisma.js";
import { ApiError } from "../utils/index.js";
import { OTP_PURPOSE } from "../constants/index.js";
import { OTP_CONFIG } from "../config/otp.config.js";

//  GENERATE  OTP
const generateOtp = () => {
  const otp = Math.floor(
    10 ** (OTP_CONFIG.LENGTH - 1) +
      Math.random() * 9 * 10 ** (OTP_CONFIG.LENGTH - 1)
  );
  return otp.toString();
};

//  HASH OTP
const hashOtp = otp => {
  return crypto.createHash("sha256").update(otp).digest("hex");
};

// ! CREATE OTP

export const createOtpRecord = async (userId, purpose) => {
  const existing = await prisma.otp.findFirst({
    where: {
      userId,
      purpose,
    },
  });

  // cooldown check
  if (existing) {
    const secondsPassed =
      (Date.now() - new Date(existing.createdAt).getTime()) / 1000;

    if (secondsPassed < OTP_CONFIG.RESEND_COOLDOWN) {
      throw new ApiError(
        429,
        ` Wait ${Math.ceil(
          OTP_CONFIG.RESEND_COOLDOWN - secondsPassed
        )} seconds before requesting a new OTP.`
      );
    }
  }

  // Remove old OTPs for the user and purpose
  await prisma.otp.deleteMany({
    where: {
      userId,
      purpose,
    },
  });

  const otp = generateOtp();
  const otpHash = hashOtp(otp);

  const expiresAt = new Date(
    Date.now() + OTP_CONFIG.EXPIRY_MINUTES * 60 * 1000
  ); // Convert minutes to milliseconds

  await prisma.otp.create({
    data: {
      userId,
      otpHash,
      purpose,
      expiresAt,
    },
  });
  return otp;
};

// ! VERIFY OTP

export const verifyOtpRecord = async (userId, otp, purpose) => {
  const record = await prisma.otp.findFirst({
    where: {
      userId,
      purpose,
    },
  });

  if (!record) {
    throw new ApiError(400, "OTP not found");
  }

  // Check expiration
  if (record.expiresAt < new Date()) {
    await prisma.otp.delete({ where: { id: record.id } });
    throw new ApiError(400, "OTP expired");
  }

  // too many attempts check
  if (record.attempts >= OTP_CONFIG.MAX_ATTEMPTS) {
    await prisma.otp.delete({ where: { id: record.id } });
    throw new ApiError(400, "Too many attempts. request a new OTP.");
  }

  const hashed = hashOtp(otp);

  // Check OTP match
  if (hashed !== record.otpHash) {
    await prisma.otp.update({
      where: { id: record.id },
      data: { attempts: record.attempts + 1 },
    });
    throw new ApiError(400, "Invalid OTP");
  }

  // OTP is valid, delete it
  await prisma.otp.delete({ where: { id: record.id } });

  return true;
};
