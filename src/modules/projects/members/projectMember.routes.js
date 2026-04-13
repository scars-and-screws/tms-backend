import { Router } from "express";
import {
  validate,
  requireProjectRole,
  requireProjectMember,
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
  requireProjectMember,
  requireProjectRole(["ADMIN"]),
  validate(addProjectMemberSchema),
  addProjectMemberController
);

// ! LIST MEMBERS
router.get("/", requireProjectMember, listProjectMembersController);

// ! UPDATE MEMBER ROLE
router.patch(
  "/:memberId",
  requireProjectMember,
  requireProjectRole(["ADMIN"]),
  validate(updateProjectMemberRoleSchema),
  updateProjectMemberRoleController
);

// ! REMOVE MEMBER
router.delete(
  "/:memberId",
  requireProjectMember,
  requireProjectRole(["ADMIN"]),
  validate(removeProjectMemberSchema),
  removeProjectMemberController
);

export default router;
