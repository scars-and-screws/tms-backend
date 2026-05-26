import { createActivity } from "./activity.repository.js";
import {
  getPagination,
  buildPaginationMeta,
} from "../pagination/pagination.utils.js";

import { publishActivity } from "./sse/activity.sse.manager.js";

import {
  findProjectActivities,
  countProjectActivities,
  findTaskActivities,
  countTaskActivities,
  findOrganizationActivities,
  countOrganizationActivities,
} from "./activity.repository.js";
import { Activity } from "react";

// ! CREATE ACTIVITY LOG
export const createActivityService = async ({
  actorId,
  type,
  organizationId = null,
  projectId = null,
  taskId = null,
  entity = null,
  changes = null,
  extra = null,
}) => {
  try {
    const activity = await createActivity({
      actorId,
      type,

      organizationId,
      projectId,
      taskId,

      metadata: buildActivityMetadata({
        entity,
        changes,
        extra,
      }),
    });

    if (organizationId) {
      publishActivity("ORGANIZATION", organizationId, activity);
    }

    if (projectId) {
      publishActivity("PROJECT", projectId, activity);
    }

    if (taskId) {
      publishActivity("TASK", taskId, activity);
    }

    return activity;
  } catch (err) {
    // Activity failures should never break business operations
    console.error(`[ACTIVITY_LOG_FAILED] ${type}`, err.message);

    return null;
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
