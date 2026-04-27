import ms from "ms";
import { JWT_REFRESH_TOKEN_EXPIRATION } from "../config/env.js";

// ! FUNCTION TO CALCULATE THE EXPIRATION DATE

// ? ms IS A UTILITY FUNCTION THAT CONVERTS THE JWT_REFRESH_TOKEN_EXPIRATION VALUE

const getRefreshTokenExpiry = () => {
  return new Date(Date.now() + ms(JWT_REFRESH_TOKEN_EXPIRATION));
};

export default getRefreshTokenExpiry;
