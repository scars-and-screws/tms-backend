import { ZodError } from "zod";
import { ApiError } from "../utils/index.js";

// ! MIDDLEWARE TO VALIDATE REQUEST BODY, QUERY PARAMETERS, AND ROUTE PARAMETERS USING ZOD SCHEMAS AND RETURN A 400 BAD REQUEST ERROR IF VALIDATION FAILS
const validate = schema => (req, res, next) => {
  try {
    // We check if the schema has defined validation rules for the request body, route parameters, and query parameters, and if so, we parse and validate the corresponding parts of the request using the Zod schemas. If any of the validations fail, a ZodError will be thrown which we catch and format into a structured error response with details about which fields failed validation and why.
    if (schema.body) {
      req.body = schema.body.parse(req.body);
    }
    if (schema.params) {
      req.params = schema.params.parse(req.params);
    }
    if (schema.query) {
      req.query = schema.query.parse(req.query);
    }

    // If all validations pass, we call the next middleware to continue processing the request
    next();
  } catch (error) {
    // If a ZodError is caught, we format the error details and return a 400 Bad Request error with the validation failure information. If the error is not a ZodError, we pass it to the next error handling middleware.
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
