import ms from "ms";
import { JWT_REFRESH_TOKEN_EXPIRATION, NODE_ENV } from "../config/env.js";

// ! FUNCTION TO SET A REFRESH TOKEN IN AN HTTP-ONLY COOKIE
const setRefreshTokenCookie = (res, token) => {
  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: NODE_ENV === "production",
    sameSite: "strict",
    maxAge: ms(JWT_REFRESH_TOKEN_EXPIRATION),
  });
};

export default setRefreshTokenCookie;
