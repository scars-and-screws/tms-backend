import prisma from "../database/prisma.js";
import { ApiError } from "../utils/index.js";

// ! MIDDLEWARE TO REQUIRE VERIFIED EMAIL FOR ACCESSING CERTAIN RESOURCES THAT SHOULD ONLY BE ACCESSIBLE TO USERS WITH VERIFIED EMAILS
const requireVerifiedEmail = async (req, res, next) => {
  // Extract the userId from the authenticated user information attached to the request object by the authenticate middleware, we use optional chaining to avoid errors if req.user is undefined for some reason
  const userId = req.user?.id;

  // If the userId is not available, it means the user is not authenticated or there was an issue with the authentication middleware, so we return a 401 Unauthorized error
  if (!userId) {
    return next(new ApiError(401, "Unauthorized"));
  }

  // Query the database to get the user's email verification status using the userId, we only select the isEmailVerified field since that's all we need for this check
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { isEmailVerified: true },
  });

  // If the user is not found in the database, it means there is an issue with the authentication middleware or the user record was deleted after authentication, so we return a 401 Unauthorized error
  if (!user) {
    return next(new ApiError(401, "User not found"));
  }

  // If the user's email is not verified, we return a 403 Forbidden error since the user does not have permission to access the resource until they verify their email
  if (!user.isEmailVerified) {
    return next(
      new ApiError(
        403,
        "Please verify your email before accessing this resource"
      )
    );
  }

  // If the user's email is verified, we call the next middleware to continue processing the request
  next();
};

export default requireVerifiedEmail;
