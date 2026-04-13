import { findOrganizationMember } from "../../modules/organizations/members/organizationMember.repository.js";
import { ApiError, asyncHandler } from "../utils/index.js";

// ! REQUIRE ORGANIZATION MEMBER MIDDLEWARE TO CHECK IF THE AUTHENTICATED USER IS A MEMBER OF THE ORGANIZATION THEY ARE TRYING TO ACCESS
const requireOrganizationMember = asyncHandler(async (req, res, next) => {
  // Extract the organizationId from the route parameters and the userId from the authenticated user information attached to the request object by the authenticate middleware
  const { organizationId } = req.params;
  const userId = req.user.id;

  if (!organizationId) {
    throw new ApiError(400, "Organization ID is required");
  }

  // Query the database to check if there is a membership record for the given organizationId and userId its a composite unique key so it will return at most one record
  const membership = await findOrganizationMember(userId, organizationId);

  // If no membership record is found, it means the user is not a member of the organization, so we throw a 403 Forbidden error
  if (!membership) {
    throw new ApiError(403, "You do not have access to this organization");
  }

  // If a membership record is found, we attach it to the request object for use in subsequent middleware or route handlers and call the next middleware to continue processing the request
  req.organizationMemberShip = membership;
  next();
});

export default requireOrganizationMember;
