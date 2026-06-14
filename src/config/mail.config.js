export const MAIL_CONFIG = {
  SERVICE: process.env.EMAIL_SERVICE || "gmail",
  USER: process.env.EMAIL_USER,
  PASS: process.env.EMAIL_PASS,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
};
