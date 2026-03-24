import { asyncHandler, ApiResponse } from "../../../core/utils/index.js";
import {
  addMemberService,
  listMembersQueryService,
  updateMemberRoleService,
  removeMemberService,
} from "./index.js";

// ! ADD MEMBER CONTROLLER
export const addMemberController = asyncHandler(async (req, res) => {
  const { organizationId } = req.params;
  const { email, role } = req.body;
  const actorId = req.user.id;

  const member = await addMemberService({
    organizationId,
    email,
    role,
    actorId,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, member, "Member added successfully"));
});

// ! LIST MEMBERS CONTROLLER
export const listMembersController = asyncHandler(async (req, res) => {
  const { organizationId } = req.params;

  const members = await listMembersQueryService(organizationId);

  return res
    .status(200)
    .json(new ApiResponse(200, members, "Members retrieved successfully"));
});

// ! UPDATE MEMBER ROLE CONTROLLER
export const updateMemberRoleController = asyncHandler(async (req, res) => {
  const { organizationId, memberId } = req.params;
  const { role } = req.body;
  const actorId = req.user.id;

  const updatedMember = await updateMemberRoleService({
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
});

// ! REMOVE MEMBER CONTROLLER
export const removeMemberController = asyncHandler(async (req, res) => {
  const { organizationId, memberId } = req.params;
  const actorId = req.user.id;

  await removeMemberService({
    organizationId,
    memberId,
    actorId,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Member removed successfully"));
});
