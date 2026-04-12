import { generateOtp, hashOtp, OTP_CONFIG } from "./index.js";
import prisma from "../database/prisma.js";
import { ApiError } from "../utils/index.js";

// ! SERVICE TO CREATE OTP RECORD IN THE DATABASE FOR A SPECIFIC USER AND PURPOSE. THIS FUNCTION FIRST CHECKS IF THERE IS AN EXISTING OTP RECORD FOR THE GIVEN USER AND PURPOSE, AND IF SO, IT ENFORCES A COOLDOWN PERIOD BEFORE ALLOWING A NEW OTP TO BE GENERATED. IF THE COOLDOWN PERIOD HAS NOT PASSED, IT THROWS A 429 Too Many Requests ERROR WITH INFORMATION ABOUT HOW LONG THE USER NEEDS TO WAIT BEFORE REQUESTING A NEW OTP. IF THERE IS NO EXISTING RECORD OR THE COOLDOWN PERIOD HAS PASSED, IT DELETES ANY OLD OTP RECORDS FOR THE USER AND PURPOSE, GENERATES A NEW OTP, HASHES IT, CALCULATES THE EXPIRATION TIME BASED ON THE CONFIGURATION, AND CREATES A NEW OTP RECORD IN THE DATABASE WITH THE HASHED OTP, PURPOSE, AND EXPIRATION TIME. FINALLY, IT RETURNS THE PLAIN TEXT OTP SO IT CAN BE SENT TO THE USER.

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

  // delete any old records before creating new one
  await prisma.otp.deleteMany({
    where: {
      userId,
      purpose,
    },
  });

  // generate new OTP, hash it, and create a new record in the database with the hashed OTP, purpose, and expiration time
  const otp = generateOtp();
  const otpHash = hashOtp(otp);

  // calculate expiration time based on the current time and the configured expiry duration for OTPs, which is typically set in minutes. We convert the expiry duration from minutes to milliseconds and add it to the current time to get the expiration timestamp for the OTP record.
  const expiresAt = new Date(
    Date.now() + OTP_CONFIG.EXPIRY_MINUTES * 60 * 1000
  );

  // create a new OTP record in the database with the hashed OTP, purpose, and expiration time. We use the Prisma client to interact with the database and create a new record in the OTP table with the specified data.
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

// ! SERVICE TO VERIFY AN OTP RECORD FOR A SPECIFIC USER AND PURPOSE. THIS FUNCTION FIRST QUERIES THE DATABASE TO FIND AN OTP RECORD THAT MATCHES THE GIVEN USER ID AND PURPOSE. IF NO RECORD IS FOUND, IT THROWS A 400 Bad Request ERROR INDICATING THAT THE OTP RECORD WAS NOT FOUND. IF A RECORD IS FOUND, IT CHECKS IF THE OTP HAS EXPIRED BY COMPARING THE CURRENT TIME WITH THE EXPIRATION TIME OF THE RECORD. IF THE OTP HAS EXPIRED, IT DELETES THE RECORD FROM THE DATABASE AND THROWS A 400 Bad Request ERROR INDICATING THAT THE OTP HAS EXPIRED. IF THE NUMBER OF ATTEMPTS TO VERIFY THE OTP HAS REACHED OR EXCEEDED THE MAXIMUM ALLOWED ATTEMPTS (CONFIGURED IN OTP_CONFIG), IT DELETES THE RECORD AND THROWS A 400 Bad Request ERROR INDICATING THAT THERE HAVE BEEN TOO MANY INCORRECT ATTEMPTS AND THE USER NEEDS TO REQUEST A NEW OTP. IF THE OTP IS STILL VALID AND HAS NOT EXCEEDED ATTEMPTS, IT HASHES THE INPUT OTP AND COMPARES IT TO THE HASH STORED IN THE DATABASE. IF THEY DO NOT MATCH, IT INCREMENTS THE ATTEMPTS COUNT IN THE DATABASE AND THROWS A 400 Bad Request ERROR INDICATING THAT THE OTP IS INVALID. IF THEY MATCH, IT DELETES THE OTP RECORD FROM THE DATABASE AND RETURNS TRUE TO INDICATE SUCCESSFUL VERIFICATION.

export const verifyOtpRecord = async ({ userId, otp, purpose }) => {

  // query the database to find an OTP record that matches the given user ID and purpose. We use the Prisma client to search for a record in the OTP table that has the specified userId and purpose. If no such record is found, we throw a 400 Bad Request error indicating that the OTP record was not found.
  const record = await prisma.otp.findFirst({
    where: {
      userId,
      purpose,
    },
  });

  if (!record) {
    throw new ApiError(400, "OTP record not found");
  }

  // check if the OTP has expired by comparing the current time with the expiration time of the record. If the current time is greater than the expiresAt timestamp stored in the record, it means the OTP has expired. In this case, we delete the record from the database to clean up expired OTPs and throw a 400 Bad Request error indicating that the OTP has expired.
  if (record.expiresAt < new Date()) {
    await prisma.otp.delete({
      where: {
        id: record.id,
      },
    });
    throw new ApiError(400, "OTP expired");
  }

  // check if the number of attempts to verify the OTP has reached or exceeded the maximum allowed attempts (configured in OTP_CONFIG). If the attempts count in the record is greater than or equal to the MAX_ATTEMPTS value, it means the user has made too many incorrect attempts to verify the OTP. In this case, we delete the record from the database to prevent further attempts and throw a 400 Bad Request error indicating that there have been too many incorrect attempts and the user needs to request a new OTP.
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

  // hash the input OTP and compare it to the hash stored in the database. We use the hashOtp function to create a hash of the input OTP.
  const hashedInputOtp = hashOtp(otp);

  // if the hashed input OTP does not match the hash stored in the database, it means the OTP is invalid. In this case, we increment the attempts count in the database for that record to keep track of how many incorrect attempts have been made, and then throw a 400 Bad Request error indicating that the OTP is invalid.
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

  // if the hashed input OTP matches the hash stored in the database, it means the OTP is valid. In this case, we delete the OTP record from the database to prevent reuse and return true to indicate successful verification.
  await prisma.otp.delete({
    where: {
      id: record.id,
    },
  });

  // if we reach this point, it means the OTP is valid and has been successfully verified, so we return true to indicate success.
  return true;
};
