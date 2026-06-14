import {
  generateAccessToken,
  generateRefreshToken,
  hashToken,
} from "../../../../infrastructure/security/index.js";

const generateSessionTokens = payload => {
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);
  const tokenHash = hashToken(refreshToken);

  return { accessToken, refreshToken, tokenHash };
};

export default generateSessionTokens;
