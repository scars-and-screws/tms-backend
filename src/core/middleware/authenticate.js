import { verifyAccessToken } from "../security/index.js";
import { ApiError } from "../utils/index.js";

// ! MIDDLEWARE TO AUTHENTICATE ACCESS TOKEN
const authenticate = (req, res, next) => {

  // Extract the token from the Authorization header
  const authHeader = req.headers.authorization;

  // Check if the token is present and properly formatted
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new ApiError(401, "Access token missing"));
  }

  // Extract the token without the "Bearer " prefix using split method
  const token = authHeader.split(" ")[1];
  try {

    // Verify the token and decode the payload
    const decoded = verifyAccessToken(token);

    // Attach the decoded user information to the request object for use in subsequent middleware or route handlers
    req.user = decoded;

    // Call the next middleware to continue processing the request if the token is valid
    next();
  } catch (err) {

    // If the token is invalid or expired, return a 401 Unauthorized error
    return next(new ApiError(401, "Invalid or expired access token"));
  }
};

export default authenticate;