import prisma from "../database/prisma.js";
import { ApiError } from "../utils/index.js";

const requireVerifiedEmail = async (req, res, next) => {
  const userId = req.user?.id;

  if (!userId) {
    return next(new ApiError(401, "Unauthorized"));
  }
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { isEmailVerified: true },
  });
  if (!user) {
    return next(new ApiError(401, "User not found"));
  }
  if (!user.isEmailVerified) {
    return next(
      new ApiError(
        403,
        "Please verify your email before accessing this resource"
      )
    );
  }
  next();
};

export default requireVerifiedEmail;
