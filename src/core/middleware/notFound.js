import { ApiError } from "../utils/index.js";

// ! MIDDLEWARE TO HANDLE 404 NOT FOUND ERRORS FOR UNDEFINED ROUTES AND PASS THEM TO THE ERROR HANDLER
const notFound = (req, res, next) => {
  next(new ApiError(404, `Route ${req.originalUrl} not found`));
};
export default notFound;
