import { Router } from "express";
import {
  createProjectController,
  createProjectSchema,
  listProjectsController,
} from "./index.js";
import {
  validate,
  requireOrganizationRole,
} from "../../../core/middleware/index.js";

const router = Router({ mergeParams: true });

// ! CREATE PROJECT
router.post(
  "/",
  requireOrganizationRole(["OWNER", "ADMIN"]),
  validate(createProjectSchema),
  createProjectController
);

// ! LIST PROJECTS
router.get("/", listProjectsController);

export default router;
