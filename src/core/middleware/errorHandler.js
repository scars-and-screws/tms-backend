import { NODE_ENV } from "../config/env.js";

const errorHandler = (err, req, res, next) => {
  console.error("Error:", err);

  // Prisma unique constraint violation error
  if (err.code === "P2002") {
    return res.status(409).json({
      success: false,
      message: "Duplicate entry found",
      errors: err.meta ? err.meta.target : null,
    });
  }

  const statusCode = err.statusCode || 500;

  // Send a JSON response with the error message and details based on the environment and error type
  res.status(statusCode).json({
    success: false,
    message:
      NODE_ENV === "development"
        ? err.message
        : statusCode === 500
          ? "Internal Server Error"
          : err.message,
    errors: err.errors || null,
  });
};

export default errorHandler;
