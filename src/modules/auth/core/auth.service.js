import prisma from "../../../core/database/prisma.js";
import { hashPassword, comparePassword } from "../../../core/security/index.js";

import { ApiError } from "../../../core/utils/index.js";
import { createSessionService } from "../session/index.js";
import { sendEmailVerificationService } from "../verification/index.js";
import { createOtpRecord, OTP_PURPOSE } from "../../../core/otp/index.js";
import { sendMail, verificationTemplate } from "../../../core/mail/index.js";

// ! USER REGISTER SERVICE
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
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email }, { username }],
    },
  });

  if (existingUser) {
    throw new ApiError(409, "User with this email or username already exists");
  }

  // * 2️⃣ Hash the password
  const passwordHash = await hashPassword(password);

  // * 3️⃣ Create the user
  const user = await prisma.user.create({
    data: {
      username,
      email,
      passwordHash,
      firstName,
      lastName,
      bio,
      headline,
      skills: skills || [],
    },
  });

  const { accessToken, refreshToken } = await createSessionService(user, meta);

  // * 6️⃣ Send verification email (don't block registration if email fails)
  try {
    await sendEmailVerificationService(user.id);
  } catch (err) {
    console.error("Failed to send verification email:", err.message);
  }

  return { user, accessToken, refreshToken };
};

// ! USER LOGIN SERVICE
export const loginService = async ({ identifier, password }, meta) => {
  // * 1️⃣ Find user by email OR username

  const user = await prisma.user.findFirst({
    where: {
      OR: [{ email: identifier }, { username: identifier }],
    },
  });

  if (!user) throw new ApiError(401, "Invalid credentials");

  // * 2️⃣ Compare password
  const isPasswordValid = await comparePassword(password, user.passwordHash);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  // * 3️⃣ Check 2FA
  if (user.twoFactorEnabled) {
    const otp = await createOtpRecord({
      userId: user.id,
      purpose: OTP_PURPOSE.TWO_FACTOR,
    });

    await sendMail({
      to: user.email,
      subject: "Your 2FA Code",
      html: verificationTemplate(otp),
    });
    return { twofactorRequired: true, tempUserId: user.id };
  }

  // * 4️⃣ Finalize login (create session and return tokens)
  return await finalizeLoginService(user, meta);
};

// ! FINALIZE LOGIN
export const finalizeLoginService = async (user, meta) => {
  const { accessToken, refreshToken } = await createSessionService(user, meta);
  return { user, accessToken, refreshToken };
};
