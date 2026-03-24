import crypto from "crypto";
import { OTP_CONFIG } from "./index.js";

// ! FUNCTION TO GENERATE A SECURE OTP
const generateOtp = () => {
  const buffer = crypto.randomBytes(4); // 4 bytes = 32 bits
  const number = buffer.readUInt32BE(0); // Read as big-endian unsigned integer
  const otp = number % 10 ** OTP_CONFIG.LENGTH; // Limit to desired length
  return otp.toString().padStart(OTP_CONFIG.LENGTH, "0"); // Pad with leading zeros if necessary
};

export default generateOtp;
