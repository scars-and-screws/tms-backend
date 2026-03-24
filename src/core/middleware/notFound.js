import { ApiError } from "../utils/index.js";

const notFound = (req, res, next) => {
  next(new ApiError(404, `Route ${req.originalUrl} not found`));
};
export default notFound;
