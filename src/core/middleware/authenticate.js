import { verifyAccessToken } from "../security/index.js";
import { ApiError } from "../utils/index.js";

// ! MIDDLEWARE TO AUTHENTICATE ACCESS TOKEN
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new ApiError(401, "Access token missing"));
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = verifyAccessToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    return next(new ApiError(401, "Invalid or expired access token"));
  }
};

export default authenticate;
