// For handling API errors in a structured way

class ApiError extends Error {
  constructor (
    statusCode,
    message = "Something went wrong",
    errors = null,
    stack = ""
  ) {
    super(message);
    this.success = false;
    this.statusCode = statusCode;
    this.data = null;
    this.message = message;
    this.errors = errors;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ApiError;
