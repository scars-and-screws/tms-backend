import prisma from "../../../core/database/prisma.js";
import { ApiError } from "../../../core/utils/index.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../../../core/upload/index.js";

export const uploadOrganizationLogoService = async (
  organizationId,
  file,
) => {
  console.log("FILE", file);
  console.log("Organization ID", organizationId);
  if (!file) {
    throw new ApiError(400, "Organization logo file is required");
  }

  // 1️⃣ Find organization and get current logo public ID
  const organization = await prisma.organization.findUnique({
    where: { id: organizationId },
    select: { logoPublicId: true },
  });

  if (!organization) {
    throw new ApiError(404, "Organization not found");
  }

  // 2️⃣ Upload logo to Cloudinary
  const { url, publicId } = await uploadToCloudinary(file, "organization_logo");

  // 3️⃣ Update organization with new logo information
  await prisma.organization.update({
    where: { id: organizationId },
    data: { logoUrl: url, logoPublicId: publicId },
  });

  // 4️⃣ Delete old logo from Cloudinary if it exists
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
