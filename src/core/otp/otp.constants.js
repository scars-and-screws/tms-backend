// ! CONSTANTS RELATED TO OTP (ONE-TIME PASSWORD) FUNCTIONALITY, SUCH AS THE PURPOSES FOR WHICH OTPs CAN BE GENERATED AND USED IN THE APPLICATION. THESE constants can be used throughout the application to ensure consistency when referring to different OTP purposes and to avoid hardcoding string values in multiple places.

export const OTP_PURPOSE = {
  EMAIL_VERIFY: "EMAIL_VERIFY",
  PASSWORD_RESET: "PASSWORD_RESET",
  TWO_FACTOR: "TWO_FACTOR",
};
