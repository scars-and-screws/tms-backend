import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import {
  errorHandler,
  notFound,
  authenticate,
  requireVerifiedEmail,
} from "./core/middleware/index.js";
import { authRoutes } from "./modules/auth/index.js";
import { userRoutes } from "./modules/users/index.js";
import { organizationRoutes } from "./modules/organizations/index.js";

const app = express();

// MIDDLEWARE
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

// PUBLIC AUTH ROUTES
app.use("/api/v1/auth", authRoutes);

// PROTECTED ROUTES - AUTHENTICATION REQUIRED
app.use("/api/v1/users", authenticate, userRoutes);
// PROTECTED ROUTES - AUTHENTICATION +VERIFIED EMAIL
app.use(
  "/api/v1/organizations",
  authenticate,
  requireVerifiedEmail,
  organizationRoutes
);

// ERROR HANDLER
app.use(notFound);
app.use(errorHandler);

export default app;
