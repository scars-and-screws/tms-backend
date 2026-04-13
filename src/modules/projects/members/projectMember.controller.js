import { asyncHandler, ApiResponse } from "../../../core/utils/index.js";
import {
  addProjectMemberService,
  listProjectMembersService,
  updateProjectMemberRoleService,
  removeProjectMemberService,
  leaveProjectService,
} from "./index.js";

// ! ADD PROJECT MEMBER CONTROLLER
export const addProjectMemberController = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { userId, role } = req.body;
  const actorId = req.user.id;

  const member = await addProjectMemberService(
    projectId,
    userId,
    role,
    actorId
  );

  return res
    .status(201)
    .json(new ApiResponse(201, member, "Project member added successfully"));
});

// ! LIST PROJECT MEMBERS CONTROLLER
export const listProjectMembersController = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  const members = await listProjectMembersService(projectId);

  return res
    .status(200)
    .json(
      new ApiResponse(200, members, "Project members retrieved successfully")
    );
});

// ! UPDATE PROJECT MEMBER ROLE CONTROLLER
export const updateProjectMemberRoleController = asyncHandler(
  async (req, res) => {
    const { memberId } = req.params;
    const { newRole } = req.body;
    const actorId = req.user.id;

    const updated = await updateProjectMemberRoleService(
      memberId,
      newRole,
      actorId
    );

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          updated,
          "Project member role updated successfully"
        )
      );
  }
);

// ! REMOVE PROJECT MEMBER CONTROLLER
export const removeProjectMemberController = asyncHandler(async (req, res) => {
  const { memberId } = req.params;
  const actorId = req.user.id;
  await removeProjectMemberService(memberId, actorId);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Project member removed successfully"));
});

// ! LEAVE PROJECT CONTROLLER
export const leaveProjectController = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const userId = req.user.id;
  await leaveProjectService(projectId, userId);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "You left the project successfully"));
});
