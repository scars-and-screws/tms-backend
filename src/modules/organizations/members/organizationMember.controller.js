import { asyncHandler, ApiResponse } from "../../../core/utils/index.js";
import {
  addOrganizationMemberService,
  listOrganizationMembersService,
  updateOrganizationMemberRoleService,
  removeOrganizationMemberService,
} from "./index.js";

// ! ADD ORGANIZATION MEMBER CONTROLLER
export const addOrganizationMemberController = asyncHandler(
  async (req, res) => {
    const { organizationId } = req.params;
    const { email, role } = req.body;
    const actorId = req.user.id;

    const member = await addOrganizationMemberService({
      organizationId,
      email,
      role,
      actorId,
    });

    return res
      .status(201)
      .json(new ApiResponse(201, member, "Member added successfully"));
  }
);

// ! LIST ORGANIZATION MEMBERS CONTROLLER
export const listOrganizationMembersController = asyncHandler(
  async (req, res) => {
    const { organizationId } = req.params;

    const members = await listOrganizationMembersService(organizationId);

    return res
      .status(200)
      .json(new ApiResponse(200, members, "Members retrieved successfully"));
  }
);

// ! UPDATE ORGANIZATION MEMBER ROLE CONTROLLER
export const updateOrganizationMemberRoleController = asyncHandler(
  async (req, res) => {
    const { organizationId, memberId } = req.params;
    const { role } = req.body;
    const actorId = req.user.id;

    const updatedMember = await updateOrganizationMemberRoleService({
      organizationId,
      memberId,
      newRole: role,
      actorId,
    });

    return res
      .status(200)
      .json(
        new ApiResponse(200, updatedMember, "Member role updated successfully")
      );
  }
);

// ! REMOVE ORGANIZATION MEMBER CONTROLLER
export const removeOrganizationMemberController = asyncHandler(
  async (req, res) => {
    const { organizationId, memberId } = req.params;
    const actorId = req.user.id;

    await removeOrganizationMemberService({
      organizationId,
      memberId,
      actorId,
    });

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Member removed successfully"));
  }
);
