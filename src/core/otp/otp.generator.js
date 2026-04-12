import crypto from "crypto";
import { OTP_CONFIG } from "./index.js";

// ! FUNCTION TO GENERATE A SECURE RANDOM OTP (ONE-TIME PASSWORD) OF A SPECIFIED LENGTH USING THE CRYPTO MODULE. THE FUNCTION GENERATES A RANDOM 32-BIT NUMBER AND THEN MODULO DIVIDES IT TO LIMIT IT TO THE DESIRED NUMBER OF DIGITS, FINALLY RETURNING IT AS A STRING PADDED WITH LEADING ZEROS IF NECESSARY TO ENSURE IT HAS THE CORRECT LENGTH.
const generateOtp = () => {
  const buffer = crypto.randomBytes(4); // 4 bytes = 32 bits
  const number = buffer.readUInt32BE(0); // Read as big-endian unsigned integer
  const otp = number % 10 ** OTP_CONFIG.LENGTH; // Limit to desired length
  return otp.toString().padStart(OTP_CONFIG.LENGTH, "0"); // Pad with leading zeros if necessary
};

export default generateOtp;
