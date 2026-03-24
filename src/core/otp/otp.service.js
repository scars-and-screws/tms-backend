import { generateOtp, hashOtp, OTP_CONFIG } from "./index.js";
import prisma from "../database/prisma.js";
import { ApiError } from "../utils/index.js";
// ! SERVICE TO CREATE OTP RECORD
export const createOtpRecord = async ({ userId, purpose }) => {
  const existingRecord = await prisma.otp.findFirst({
    where: {
      userId,
      purpose,
    },
  });

  if (existingRecord) {
    const secondsSinceLastOtp =
      (Date.now() - new Date(existingRecord.createdAt).getTime()) / 1000;
    if (secondsSinceLastOtp < OTP_CONFIG.RESEND_COOLDOWN) {
      throw new ApiError(
        429,
        `Please wait ${Math.ceil(
          OTP_CONFIG.RESEND_COOLDOWN - secondsSinceLastOtp
        )} seconds before requesting a new OTP`
      );
    }
  }

  // delete any old reords before creating new one
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
  );

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

// ! SERVICE TO VERIFY OTP RECORD
export const verifyOtpRecord = async ({ userId, otp, purpose }) => {
  const record = await prisma.otp.findFirst({
    where: {
      userId,
      purpose,
    },
  });

  if (!record) {
    throw new ApiError(400, "OTP record not found");
  }

  if (record.expiresAt < new Date()) {
    await prisma.otp.delete({
      where: {
        id: record.id,
      },
    });
    throw new ApiError(400, "OTP expired");
  }

  if (record.attempts >= OTP_CONFIG.MAX_ATTEMPTS) {
    await prisma.otp.delete({
      where: {
        id: record.id,
      },
    });
    throw new ApiError(
      400,
      "Too many incorrect attempts. Please request a new OTP"
    );
  }

  const hashedInputOtp = hashOtp(otp);

  if (hashedInputOtp !== record.otpHash) {
    await prisma.otp.update({
      where: {
        id: record.id,
      },
      data: {
        attempts: record.attempts + 1,
      },
    });

    throw new ApiError(400, "Invalid OTP");
  }

  await prisma.otp.delete({
    where: {
      id: record.id,
    },
  });

  return true;
};
