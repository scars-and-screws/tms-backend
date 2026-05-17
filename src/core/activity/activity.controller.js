import { asyncHandler, ApiResponse } from "../utils/index.js";

import { listProjectActivitiesService } from "./activity.service.js";

// ! LIST PROJECT ACTIVITIES CONTROLLER
export const listProjectActivitiesController = asyncHandler(
  async (req, res) => {
    const result = await listProjectActivitiesService({
      projectId: req.params.projectId,
      query: req.query,
    });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          result,
          "Project activities retrieved successfully"
        )
      );
  }
);
