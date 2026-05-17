import { createActivity } from "./activity.repository.js";
import {
  getPagination,
  buildPaginationMeta,
} from "../pagination/pagination.utils.js";

import {
  findProjectActivities,
  countProjectActivities,
  findTaskActivities,
  countTaskActivities,
  findOrganizationActivities,
  countOrganizationActivities,
} from "./activity.repository.js";

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
    await createActivity({
      actorId,
      type,
      organizationId,
      projectId,
      taskId,
      metadata,
    });
  } catch (err) {
    // ACTIVITY LOGGING FAILURE SHOULD NOT BLOCK MAIN OPERATION, LOG ERROR AND CONTINUE
    console.error("Activity logging failed:", err.message);
  }
};

// ! LIST PROJECT ACTIVITIES SERVICE
export const listProjectActivitiesService = async ({ projectId, query }) => {
  // 1️⃣ Normalize pagination
  const pagination = getPagination(query);

  // 2️⃣ Fetch activities + total count in parallel
  const [activities, total] = await Promise.all([
    findProjectActivities({
      projectId,
      skip: pagination.skip,
      limit: pagination.limit,
    }),

    countProjectActivities(projectId),
  ]);

  // 3️⃣ Build pagination metadata
  const paginationMeta = buildPaginationMeta({
    total,
    page: pagination.page,
    limit: pagination.limit,
  });

  // 4️⃣ Return paginated response
  return {
    activities,
    pagination: paginationMeta,
  };
};

// ! LIST TASK ACTIVITIES SERVICE
export const listTaskActivitiesService = async ({ taskId, query }) => {
  // 1️⃣ Normalize pagination
  const pagination = getPagination(query);

  // 2️⃣ Fetch activities + total count
  const [activities, total] = await Promise.all([
    findTaskActivities({
      taskId,
      skip: pagination.skip,
      limit: pagination.limit,
    }),

    countTaskActivities(taskId),
  ]);

  // 3️⃣ Build pagination metadata
  const paginationMeta = buildPaginationMeta({
    total,
    page: pagination.page,
    limit: pagination.limit,
  });

  // 4️⃣ Return response
  return {
    activities,
    pagination: paginationMeta,
  };
};

// ! LIST ORGANIZATION ACTIVITIES SERVICE
export const listOrganizationActivitiesService = async ({
  organizationId,
  query,
}) => {
  // 1️⃣ Normalize pagination
  const pagination = getPagination(query);

  // 2️⃣ Fetch activities + total count
  const [activities, total] = await Promise.all([
    findOrganizationActivities({
      organizationId,
      skip: pagination.skip,
      limit: pagination.limit,
    }),

    countOrganizationActivities(organizationId),
  ]);

  // 3️⃣ Build pagination metadata
  const paginationMeta = buildPaginationMeta({
    total,
    page: pagination.page,
    limit: pagination.limit,
  });

  // 4️⃣ Return response
  return {
    activities,
    pagination: paginationMeta,
  };
};
