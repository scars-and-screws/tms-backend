import { ApiError } from "../utils/index.js";

// ! MIDDLEWARE TO CHECK PROJECT ROLE
const requireProjectRole = (allowedRoles = []) => {
  return (req, res, next) => {
    const membership = req.projectMembership;

    if (!membership) {
      throw new ApiError(
        500,
        "Project Membership not loaded. Ensure requireProjectMember middleware is used before this middleware."
      );
    }

    if (!allowedRoles.includes(membership.role)) {
      throw new ApiError(
        403,
        "You do not have permission to perform this action"
      );
    }
    next();
  };
};

export default requireProjectRole;
