import prisma from "../../../core/database/prisma.js";
import { ApiError } from "../../../core/utils/index.js";
import { createActivityService } from "../../../core/activity/activity.service.js";
import { sanitizeOrganization } from "./index.js";
import { deleteFromCloudinary } from "../../../core/upload/index.js";
import {
  findOrganizationById,
  findUserOrganizations,
  findOrganizationByNameAndOwnerId,
  createOrganization,
  createOrganizationMember,
  updateOrganizationById,
  deleteOrganizationById,
} from "./organization.repository.js";
import {
  ORGANIZATION_ROLES,
  ACTIVITY_TYPES,
} from "../../../core/constants/index.js";

// ! GET ORGANIZATION SERVICE
export const getOrganizationService = async organizationId => {
  const organization = await findOrganizationById(organizationId);
  if (!organization) {
    throw new ApiError(404, "Organization not found");
  }
  return sanitizeOrganization(organization);
};

// ! LIST USER ORGANIZATIONS SERVICE
export const listUserOrganizationsService = async userId => {
  const memberships = await findUserOrganizations(userId);
  return mapOrganizationList(memberships);
};

// ! CREATE ORGANIZATION SERVICE
export const createOrganizationService = async (userId, data) => {
  const { name, description } = data;

  // 1️⃣ Check if organization name already exists for this owner
  const existing = await findOrganizationByNameAndOwnerId(name, userId);

  if (existing) {
    throw new ApiError(
      400,
      "You already created an organizaiton with this name"
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
    metadata: {
      organizationName: name,
    },
  }).catch(err => {
    console.error("Failed to log activity for organization creation:", err);
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

  // Log activity (non-blocking)
  await createActivityService({
    actorId: userId,
    type: ACTIVITY_TYPES.ORGANIZATION_UPDATED,
    organizationId,
    metadata: {
      updatedFields: Object.keys(data),
    },
  }).catch(err => {
    console.error("Failed to log activity for organization update:", err);
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
  const ownerMembership = await prisma.organizationMember.findUnique({
    where: {
      userId_organizationId: {
        userId: actorId,
        organizationId,
      },
    },
  });

  if (!ownerMembership || ownerMembership.role !== "OWNER") {
    throw new ApiError(403, "Only the owner can transfer ownership");
  }

  // 3️⃣ Fetch target (new owner) membership
  const targetMembership = await prisma.organizationMember.findUnique({
    where: {
      userId_organizationId: {
        userId: newOwnerId,
        organizationId,
      },
    },
    include: {
      user: true,
    },
  });

  if (!targetMembership) {
    throw new ApiError(
      404,
      "The new owner must be a member of the organization"
    );
  }

  // 4️⃣ Ensure target (new owner) has verified email
  if (!targetMembership.user.isEmailVerified) {
    throw new ApiError(400, "The new owner must have verified email");
  }

  // 5️⃣ Update new owner role to OWNER
  await prisma.organizationMember.update({
    where: {
      id: targetMembership.id,
    },
    data: {
      role: "OWNER",
    },
  });

  // 6️⃣ Demote current owner to ADMIN
  await prisma.organizationMember.update({
    where: {
      id: ownerMembership.id,
    },
    data: {
      role: "ADMIN",
    },
  });

  // 7️⃣ Update organization ownerId
  await prisma.organization.update({
    where: {
      id: organizationId,
    },
    data: {
      ownerId: newOwnerId,
    },
  });

  // 8️⃣ Log activity (non-blocking)
  await createActivityService({
    actorId,
    type: ACTIVITY_TYPES.OWNERSHIP_TRANSFERRED,
    organizationId,
    metadata: {
      newOwnerId,
    },
  });

  return {
    newOwnerId,
  };
};

// ! LEAVE ORGANIZATION SERVICE
export const leaveOrganizationService = async ({ organizationId, userId }) => {
  // 1️⃣ Fetch membership
  const membership = await prisma.organizationMember.findUnique({
    where: {
      userId_organizationId: {
        userId,
        organizationId,
      },
    },
  });

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
  await prisma.organizationMember.delete({
    where: {
      id: membership.id,
    },
  });

  // 4️⃣ Log activity (non-blocking)
  await createActivityService({
    actorId: userId,
    type: ACTIVITY_TYPES.MEMBER_LEFT,
    organizationId,
    metadata: { userId },
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
    metadata: { organizationName: organization.name },
  }).catch(err => {
    console.error("Failed to log activity for organization deletion:", err);
  });
};
