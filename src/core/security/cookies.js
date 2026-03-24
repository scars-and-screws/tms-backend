import ms from "ms";
import { JWT_REFRESH_TOKEN_EXPIRATION, NODE_ENV } from "../config/env.js";

// ? SETS A SECURE HTTP-ONLY COOKIE WITH THE REFRESH TOKEN, CONFIGURED TO BE SENT ONLY OVER HTTPS IN PRODUCTION AND TO EXPIRE BASED ON THE DEFINED REFRESH TOKEN EXPIRATION TIME.
const setRefreshTokenCookie = (res, token) => {
  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: NODE_ENV === "production",
    sameSite: "strict",
    maxAge: ms(JWT_REFRESH_TOKEN_EXPIRATION),
  });
};

export default setRefreshTokenCookie;
