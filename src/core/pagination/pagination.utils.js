import {
  DEFAULT_PAGE,
  DEFAULT_LIMIT,
  MAX_LIMIT,
} from "./pagination.constants.js";

// 1️⃣ Normalize and calculate pagination values
export const getPagination = query => {
  // 2️⃣ Parse page
  const page = Number(query.page) > 0 ? Number(query.page) : DEFAULT_PAGE;

  // 3️⃣ Parse limit
  let limit = Number(query.limit) > 0 ? Number(query.limit) : DEFAULT_LIMIT;

  // 4️⃣ Enforce max limit
  if (limit > MAX_LIMIT) {
    limit = MAX_LIMIT;
  }

  // 5️⃣ Calculate skip
  const skip = (page - 1) * limit;

  return {
    page,
    limit,
    skip,
  };
};

// ? Build consistent paginated response metadata
export const buildPaginationMeta = ({ total, page, limit }) => {
  const totalPages = Math.ceil(total / limit);

  return {
    total,
    page,
    limit,
    totalPages,

    hasNextPage: page < totalPages,

    hasPreviousPage: page > 1,
  };
};
