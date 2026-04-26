import { asyncHandler, ApiResponse } from "../../../core/utils/index.js";
import { uploadOrganizationLogoService } from "./logo.service.js";

export const uploadOrganizationLogoController = asyncHandler(
  async (req, res) => {
    const { organizationId } = req.params;
    const file = req.file;

    const result = await uploadOrganizationLogoService(organizationId, file);

    res
      .status(200)
      .json(
        new ApiResponse(200, result, "Organization logo uploaded successfully")
      );
  }
);
