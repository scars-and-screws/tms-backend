import { ApiError } from "../../../shared/errors/api-error.js";
import {
  createActivityService,
  ACTIVITY_TYPES,
  buildOrganizationEntity,
  buildChanges,
} from "../../activity/activity/index.js";

import {
  getPagination,
  buildPaginationMeta,
} from "../../../shared/pagination/pagination.utils.js";

import {
  sanitizeOrganization,
  mapOrganizationList,
} from "./organization.helper.js";

import { deleteFromCloudinary } from "../../../infrastructure/storage/upload.service.js";

import {
  findOrganizationById,
  findUserOrganizations,
  countUserOrganizations,
  findOrganizationByNameAndOwnerId,
  createOrganization,
  createOrganizationMember,
  updateOrganizationById,
  deleteOrganizationById,
  findOrganizationMember,
  findUserById,
  updateOrganizationMemberRole,
  deleteOrganizationMemberById,
} from "./organization.repository.js";
import { ORGANIZATION_ROLES } from "./organization.constants.js";

// ! GET ORGANIZATION SERVICE
export const getOrganizationService = async organizationId => {
  const organization = await findOrganizationById(organizationId);
  if (!organization) {
    throw new ApiError(404, "Organization not found");
  }
  return sanitizeOrganization(organization);
};

// ! LIST USER ORGANIZATIONS SERVICE
export const listUserOrganizationsService = async (userId, query) => {
  // 1️⃣ Normalize pagination
  const pagination = getPagination(query);

  // 2️⃣ Fetch in parallel
  const [memberships, total] = await Promise.all([
    findUserOrganizations({
      userId,
      skip: pagination.skip,
      limit: pagination.limit,
    }),
    countUserOrganizations(userId),
  ]);

  // 3️⃣ Build pagination metadata
  const meta = buildPaginationMeta({
    total,
    page: pagination.page,
    limit: pagination.limit,
  });

  // 4️⃣ Return
  return {
    organizations: mapOrganizationList(memberships),
    pagination: meta,
  };
};

// ! CREATE ORGANIZATION SERVICE
export const createOrganizationService = async (userId, data) => {
  const { name, description } = data;

  // 1️⃣ Check if organization name already exists for this owner
  const existing = await findOrganizationByNameAndOwnerId(name, userId);

  if (existing) {
    throw new ApiError(
      400,
      "You already created an organization with this name"
    );
  }

  // 2️⃣ Create organization
  const organization = await createOrganization({
    name,
    description,
    ownerId: userId,
  });

  // 3️⃣ Create owner membership
  await createOrganizationMember({
    userId,
    organizationId: organization.id,
    role: ORGANIZATION_ROLES.OWNER,
  });

  // 4️⃣ Log activity (non-blocking)
  await createActivityService({
    actorId: userId,

    type: ACTIVITY_TYPES.ORGANIZATION_CREATED,

    organizationId: organization.id,

    entity: buildOrganizationEntity(organization),

    extra: {
      description,
    },
  });

  // 5️⃣ Return sanitized organization
  return sanitizeOrganization(organization);
};

// ! UPDATE ORGANIZATION SERVICE
export const updateOrganizationService = async (
  organizationId,
  userId,
  data
) => {
  const organization = await findOrganizationById(organizationId);

  if (!organization) {
    throw new ApiError(404, "Organization not found");
  }

  const updated = await updateOrganizationById(organizationId, data);

  // Build changes for activity metadata
  const changes = buildChanges(organization, updated);

  // Log activity (non-blocking)
  await createActivityService({
    actorId: userId,

    type: ACTIVITY_TYPES.ORGANIZATION_UPDATED,

    organizationId,

    entity: buildOrganizationEntity(organization),

    changes,
  });

  return sanitizeOrganization(updated);
};

// ! TRANSFER ORGANIZATION OWNERSHIP SERVICE
export const transferOrganizationOwnershipService = async ({
  organizationId,
  newOwnerId,
  actorId,
}) => {
  // 1️⃣ Prevent transferring ownership to self
  if (actorId === newOwnerId) {
    throw new ApiError(400, "You are already the owner of this organization");
  }

  // 2️⃣ Fetch current owner membership
  const ownerMembership = await findOrganizationMember(actorId, organizationId);

  if (!ownerMembership || ownerMembership.role !== "OWNER") {
    throw new ApiError(403, "Only the owner can transfer ownership");
  }

  // 3️⃣ Fetch target (new owner) membership
  const targetMembership = await findOrganizationMember(
    newOwnerId,
    organizationId
  );

  if (!targetMembership) {
    throw new ApiError(
      404,
      "The new owner must be a member of the organization"
    );
  }

  // 4️⃣ Ensure target (new owner) has verified email
  const user = await findUserById(newOwnerId);

  if (!user.isEmailVerified) {
    throw new ApiError(400, "The new owner must have a verified email address");
  }

  // 5️⃣ Update new owner role to OWNER
  await updateOrganizationMemberRole(targetMembership.id, "OWNER");

  // 6️⃣ Demote current owner to ADMIN
  await updateOrganizationMemberRole(ownerMembership.id, "ADMIN");

  // 7️⃣ Update organization ownerId
  await updateOrganizationById(organizationId, { ownerId: newOwnerId });

  // 8️⃣ Log activity (non-blocking)
  await createActivityService({
    actorId,

    type: ACTIVITY_TYPES.ORGANIZATION_OWNERSHIP_TRANSFERRED,

    organizationId,

    entity: {
      id: organizationId,
      type: "ORGANIZATION",
    },

    changes: {
      ownerId: {
        before: actorId,
        after: newOwnerId,
      },
    },
  });

  return {
    newOwnerId,
  };
};

// ! LEAVE ORGANIZATION SERVICE
export const leaveOrganizationService = async ({ organizationId, userId }) => {
  // 1️⃣ Fetch membership
  const membership = await findOrganizationMember(userId, organizationId);

  if (!membership) {
    throw new ApiError(404, "Membership not found");
  }

  // 2️⃣ Prevent owner from leaving (must transfer ownership first)
  if (membership.role === "OWNER") {
    throw new ApiError(
      400,
      "Owner cannot leave the organization. Please transfer ownership before leaving."
    );
  }

  // 3️⃣ Delete membership
  await deleteOrganizationMemberById(membership.id);

  // 4️⃣ Log activity (non-blocking)
  await createActivityService({
    actorId: userId,

    type: ACTIVITY_TYPES.ORGANIZATION_MEMBER_LEFT,

    organizationId,

    entity: {
      id: userId,
      type: "USER",
    },

    changes: {
      role: {
        before: membership.role,

        after: null,
      },
    },
  });
};

// ! DELETE ORGANIZATION SERVICE
export const deleteOrganizationService = async ({
  organizationId,
  actorId,
  organizationName,
}) => {
  // 1️⃣ Fetch organization
  const organization = await findOrganizationById(organizationId);

  if (!organization) {
    throw new ApiError(404, "Organization not found");
  }

  // 2️⃣ Check if actor is the owner
  if (organization.ownerId !== actorId) {
    throw new ApiError(403, "Only organization owner can delete organization");
  }

  // 3️⃣ Name check to prevent accidental deletion
  if (organization.name !== organizationName) {
    throw new ApiError(400, "Organization name confirmation does not match");
  }

  // 4️⃣ Delete organization logo
  if (organization.logoPublicId) {
    try {
      await deleteFromCloudinary(organization.logoPublicId);
    } catch (err) {
      console.error("Failed to delete organization logo from Cloudinary:", err);
    }
  }

  // 5️⃣ Delete organization (cascades to members, projects, tasks, etc.)
  await deleteOrganizationById(organizationId);

  // 6️⃣ Log activity (non-blocking)
  await createActivityService({
    actorId,

    type: ACTIVITY_TYPES.ORGANIZATION_DELETED,

    organizationId,

    entity: buildOrganizationEntity(organization),
  });
};
