import crypto from "crypto";

// Hashes a token using SHA-256 and returns the hexadecimal representation of the hash, providing a secure way to store or compare tokens without exposing the original token value
const hashToken = token => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

export default hashToken;
