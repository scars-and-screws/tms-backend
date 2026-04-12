// ! INDEX FILE TO EXPORT ALL OTP-RELATED FUNCTIONALITY, INCLUDING THE OTP GENERATOR, HASHING FUNCTION, VALIDATION SCHEMA, CONFIGURATION, SERVICE FUNCTIONS, AND CONSTANTS. THIS CENTRALIZED EXPORT FILE MAKES IT EASY TO IMPORT ANY OTP-RELATED FUNCTIONALITY FROM A SINGLE LOCATION IN THE APPLICATION.

export { default as generateOtp } from "./otp.generator.js";
export { default as hashOtp } from "./otp.hash.js";
export { default as verifyOtpSchema } from "./otp.validation.js";
export * from "../config/otp.config.js";
export * from "./otp.service.js";
export * from "./otp.constants.js";
