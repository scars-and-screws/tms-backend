export const OTP_CONFIG = {
  LENGTH: parseInt(process.env.OTP_LENGTH) || 6,
  EXPIRY_MINUTES: parseInt(process.env.OTP_EXPIRY_MINUTES) || 10,
  MAX_ATTEMPTS: parseInt(process.env.OTP_MAX_ATTEMPTS) || 5,
  RESEND_COOLDOWN: parseInt(process.env.OTP_RESEND_COOLDOWN_SECONDS) || 60,
};
