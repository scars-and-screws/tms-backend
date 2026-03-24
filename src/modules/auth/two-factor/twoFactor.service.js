import prisma from "../../../core/database/prisma.js";
import { OTP_PURPOSE, verifyOtpRecord } from "../../../core/otp/index.js";
import { ApiError } from "../../../core/utils/index.js";
import { finalizeLoginService } from "../index.js";

export const enableTwoFactorLoginService = async userId => {
  await prisma.user.update({
    where: { id: userId },
    data: { twoFactorEnabled: true },
  });
};

export const disableTwoFactorLoginService = async userId => {
  await prisma.user.update({
    where: { id: userId },
    data: { twoFactorEnabled: false },
  });
};

export const verifyTwoFactorLoginService = async ({ userId, otp, meta }) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  await verifyOtpRecord({
    userId,
    otp,
    purpose: OTP_PURPOSE.TWO_FACTOR,
  });

  return await finalizeLoginService(user, meta);
};
