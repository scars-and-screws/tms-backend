import prisma from "../../core/database/prisma.js";

// ! CREATE ACTIVITY SERVICE
export const createActivityService = async ({
  actorId,
  type,
  organizationId = null,
  projectId = null,
  taskId = null,
  metadata = null,
}) => {
  try {
    await prisma.activity.create({
      data: {
        actorId,
        type,
        organizationId,
        projectId,
        taskId,
        metadata,
      },
    });
  } catch (err) {
    // ACTIVITY LOGGING FAILURE SHOULD NOT BLOCK MAIN OPERATION, LOG ERROR AND CONTINUE
    console.error("Activity logging failed:", err.message);
  }
};
