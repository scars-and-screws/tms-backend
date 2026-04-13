import { Router } from "express";
import {
  validate,
  requireProjectRole,
} from "../../../core/middleware/index.js";

import {
  addProjectMemberController,
  listProjectMembersController,
  updateProjectMemberRoleController,
  removeProjectMemberController,
  addProjectMemberSchema,
  updateProjectMemberRoleSchema,
  removeProjectMemberSchema,
} from "./index.js";

const router = Router({ mergeParams: true });

// ! ADD MEMBER
router.post(
  "/",
  requireProjectRole(["ADMIN"]),
  validate(addProjectMemberSchema),
  addProjectMemberController
);

// ! LIST MEMBERS
router.get("/", listProjectMembersController);

// ! UPDATE MEMBER ROLE
router.put(
  "/:memberId",
  requireProjectRole(["ADMIN"]),
  validate(updateProjectMemberRoleSchema),
  updateProjectMemberRoleController
);

// ! REMOVE MEMBER
router.delete(
  "/:memberId",
  requireProjectRole(["ADMIN"]),
  validate(removeProjectMemberSchema),
  removeProjectMemberController
);

export default router;
