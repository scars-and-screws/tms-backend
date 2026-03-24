import { asyncHandler, ApiResponse } from "../../core/utils/index.js";
import {
  createOrganizationService,
  getOrganizationQueryService,
  listUserOrganizationsQueryService,
  updateOrganizationService,
  transferOwnershipService,
  leaveOrganizationService,
  deleteOrganizationService,
} from "./index.js";

// ! CREATE ORGANIZATION CONTROLLER
export const createOrganizationController = asyncHandler(async (req, res) => {
  const organization = await createOrganizationService(req.user.id, req.body);
  res
    .status(201)
    .json(
      new ApiResponse(201, organization, "Organization created successfully")
    );
});

// ! LIST USER ORGANIZATIONS CONTROLLER
export const listUserOrganizationsController = asyncHandler(
  async (req, res) => {
    const organizations = await listUserOrganizationsQueryService(req.user.id);

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          organizations,
          "Organizations retrieved successfully"
        )
      );
  }
);

// ! GET ORGANIZATION CONTROLLER
export const getOrganizationController = asyncHandler(async (req, res) => {
  const organization = await getOrganizationQueryService(
    req.params.organizationId
  );
  res
    .status(200)
    .json(
      new ApiResponse(200, organization, "Organization retrieved successfully")
    );
});

// ! UPDATE ORGANIZATION CONTROLLER
export const updateOrganizationController = asyncHandler(async (req, res) => {
  const { organizationId } = req.params;
  const data = req.body;
  const updatedOrganization = await updateOrganizationService(
    organizationId,
    data
  );
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedOrganization,
        "Organization updated successfully"
      )
    );
});

// ! TRANSFER OWNERSHIP CONTROLLER
export const transferOwnershipController = asyncHandler(async (req, res) => {
  const { organizationId } = req.params;
  const { newOwnerId } = req.body;
  const actorId = req.user.id;

  const result = await transferOwnershipService({
    organizationId,
    newOwnerId,
    actorId,
  });
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        result,
        "Organization ownership transferred successfully"
      )
    );
});

// ! LEAVE ORGANIZATION CONTROLLER
export const leaveOrganizationController = asyncHandler(async (req, res) => {
  const { organizationId } = req.params;
  const userId = req.user.id;

  await leaveOrganizationService({ organizationId, userId });
  return res
    .status(200)
    .json(new ApiResponse(200, null, "Left organization successfully"));
});

// ! DELETE ORGANIZATION CONTROLLER
export const deleteOrganizationController = asyncHandler(async (req, res) => {
  const { organizationId } = req.params;
  const { organizationName } = req.body;
  const actorId = req.user.id;

  await deleteOrganizationService({
    organizationId,
    actorId,
    organizationName,
  });
  return res
    .status(200)
    .json(new ApiResponse(200, null, "Organization deleted successfully"));
});
