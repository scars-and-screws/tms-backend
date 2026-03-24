import {generateAccessToken, generateRefreshToken, hashToken} from "./index.js";

const generateSessionTokens = payload => {
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);
  const tokenHash = hashToken(refreshToken);

  return {accessToken, refreshToken, tokenHash};
};

export default generateSessionTokens;
