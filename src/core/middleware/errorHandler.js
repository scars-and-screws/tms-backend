import { NODE_ENV } from "../config/env.js";
import { ApiError } from "../utils/index.js";

const isDev = NODE_ENV === "development";

const errorHandler = (err, req, res, next) => {
  // 🔥 Full error log (always)
  console.error("ERROR:", {
    message: err.message,
    stack: err.stack,
    code: err.code,
  });

  // ======================================================
  // ✅ CUSTOM API ERROR (your own errors)
  // ======================================================
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors || null,
    });
  }

  // ======================================================
  // 🔥 PRISMA ERRORS
  // ======================================================

  // ❌ Unique constraint
  if (err.code === "P2002") {
    return res.status(409).json({
      success: false,
      message: "Duplicate value detected",
      errors: isDev ? err.meta?.target : null,
    });
  }

  // ❌ Record not found
  if (err.code === "P2025") {
    return res.status(404).json({
      success: false,
      message: "Resource not found",
      errors: null,
    });
  }

  // ❌ Validation error (very important)
  if (err.name === "PrismaClientValidationError") {
    return res.status(400).json({
      success: false,
      message: "Invalid data provided",
      errors: isDev ? err.message : null,
    });
  }

  // ======================================================
  // 🔥 ZOD VALIDATION (if missed somewhere)
  // ======================================================
  if (err.name === "ZodError") {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: err.errors,
    });
  }

  // ======================================================
  // 🔥 FALLBACK (UNKNOWN ERRORS)
  // ======================================================
  const statusCode = err.statusCode || 500;

  return res.status(statusCode).json({
    success: false,
    message: statusCode === 500 ? "Something went wrong" : err.message,
    errors: isDev ? err.stack : null,
  });
};

export default errorHandler;
