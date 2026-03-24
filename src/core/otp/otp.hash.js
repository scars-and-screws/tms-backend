import crypto from "crypto";

// ! FUNCTION TO HASH OTP USING SHA-256
const hashOtp = otp => {
  return crypto.createHash("sha256").update(otp).digest("hex");
};

export default hashOtp;
