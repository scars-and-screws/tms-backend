import { ApiError } from "../utils/index.js";

// ! REQUIRE ORGANIZATION ROLE MIDDLEWARE
const requireOrganizationRole = (allowedRoles = []) => {
  return (req, res, next) => {
    const membership = req.organizationMember;

    if (!membership) {
      throw new ApiError(500, "Organization membership not loaded");
    }

    const userRole = membership.role;

    if (!allowedRoles.includes(userRole)) {
      throw new ApiError(
        403,
        "You do not have permission to perform this action"
      );
    }
    next();
  };
};

export default requireOrganizationRole;
