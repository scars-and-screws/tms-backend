import { ApiError } from "../utils/index.js";

// ! REQUIRE ORGANIZATION ROLE MIDDLEWARE TO CHECK IF THE AUTHENTICATED USER HAS ONE OF THE ALLOWED ROLES IN THE ORGANIZATION THEY ARE TRYING TO ACCESS
const requireOrganizationRole = (allowedRoles = []) => {
  return (req, res, next) => {
    // The requireOrganizationMember middleware should have already been executed before this middleware, so we can access the organization membership information from the request object
    const membership = req.organizationMember;

    // If the membership information is not available, it means the requireOrganizationMember middleware was not executed or did not find a membership record, so we throw a 500 Internal Server Error since this is a server-side issue
    if (!membership) {
      throw new ApiError(500, "Organization membership not loaded");
    }

    // Check if the user's role in the organization is included in the allowedRoles array, if not, we throw a 403 Forbidden error since the user does not have permission to perform the action
    const userRole = membership.role;
    if (!allowedRoles.includes(userRole)) {
      throw new ApiError(
        403,
        "You do not have permission to perform this action"
      );
    }
    // If the user's role is included in the allowedRoles array, we call the next middleware to continue processing the request
    next();
  };
};

export default requireOrganizationRole;
