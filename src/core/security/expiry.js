import ms from "ms";
import { JWT_REFRESH_TOKEN_EXPIRATION } from "../config/env.js";

const getRefreshTokenExpiry = () => {
  return new Date(Date.now() + ms(JWT_REFRESH_TOKEN_EXPIRATION));
};

export default getRefreshTokenExpiry;
