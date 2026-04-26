import { ApiError } from "../../../core/utils/index.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../../../core/upload/index.js";

import {
  findOrganizationById,
  updateOrganizationLogo,
} from "./logo.repository.js";

export const uploadOrganizationLogoService = async (organizationId, file) => {
  // 1️⃣ Validate file presence
  if (!file) {
    throw new ApiError(400, "Organization logo file is required");
  }
  // 2️⃣ Validate file is not empty
  if (file.size === 0) {
    throw new ApiError(400, "Empty file not allowed");
  }

  // 3️⃣ Find organization and get current logo public ID
  const organization = await findOrganizationById(organizationId);

  if (!organization) {
    throw new ApiError(404, "Organization not found");
  }

  // 4️⃣ Upload logo to Cloudinary
  const { url, publicId } = await uploadToCloudinary(file, "organization_logo");

  // 5️⃣ Update Database with new logo URL and public ID
  await updateOrganizationLogo(organizationId, {
    logoUrl: url,
    logoPublicId: publicId,
  });

  // 6️⃣ Delete old logo from Cloudinary if it exists (non-blocking)
  if (organization?.logoPublicId) {
    try {
      await deleteFromCloudinary(organization.logoPublicId);
    } catch (err) {
      console.error(
        "Error while deleting old logo from Cloudinary:",
        err.message
      );
    }
  }
  return { logoUrl: url };
};
