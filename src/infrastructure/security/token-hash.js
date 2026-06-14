import crypto from "crypto";

// ! FUNCTION TO HASH A TOKEN USING THE SHA-256 ALGORITHM

const hashToken = token => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

export default hashToken;
