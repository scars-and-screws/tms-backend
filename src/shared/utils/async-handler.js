// Higher order function to wrap async route handlers and catch errors automatically, passing them to the next middleware (error handler) no need to use try-catch in every route handler

const asyncHandler = requestHandler => (req, res, next) => {
  Promise.resolve(requestHandler(req, res, next)).catch(err => next(err));
};

export default asyncHandler;
