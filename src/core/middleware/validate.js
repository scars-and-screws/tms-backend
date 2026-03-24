import { ZodError } from "zod";
import { ApiError } from "../utils/index.js";

const validate = schema => (req, res, next) => {
  try {
    if (schema.body) {
      req.body = schema.body.parse(req.body);
    }
    if (schema.params) {
      req.params = schema.params.parse(req.params);
    }
    if (schema.query) {
      req.query = schema.query.parse(req.query);
    }

    next();
  } catch (error) {
    if (error instanceof ZodError) {
      const formattedErrors = error.issues.map(issue => ({
        field: issue.path.join("."),
        message: issue.message,
      }));
      return next(new ApiError(400, "Validation failed", formattedErrors));
    }
    next(error);
  }
};
export default validate;
