import { Router } from "express";
import {
  validate,
  requireProjectRole,
  requireProjectMember,
  requireActiveProject,
} from "../../../core/middleware/index.js";

import {
  addProjectMemberController,
  listProjectMembersController,
  updateProjectMemberRoleController,
  removeProjectMemberController,
  addProjectMemberSchema,
  updateProjectMemberRoleSchema,
  removeProjectMemberSchema,
  listProjectMembersSchema,
} from "./index.js";

const router = Router({ mergeParams: true });

// ! ADD PROJECT MEMBER
router.post(
  "/",
  requireProjectMember,
  requireActiveProject,
  requireProjectRole(["ADMIN"]),
  validate(addProjectMemberSchema),
  addProjectMemberController
);

// ! LIST PROJECT MEMBERS
router.get(
  "/",
  requireProjectMember,
  validate(listProjectMembersSchema),
  listProjectMembersController
);

// ! UPDATE PROJECT MEMBER ROLE
router.patch(
  "/:memberId",
  requireProjectMember,
  requireActiveProject,
  requireProjectRole(["ADMIN"]),
  validate(updateProjectMemberRoleSchema),
  updateProjectMemberRoleController
);

// ! REMOVE PROJECT MEMBER
router.delete(
  "/:memberId",
  requireProjectMember,
  requireActiveProject,
  requireProjectRole(["ADMIN"]),
  validate(removeProjectMemberSchema),
  removeProjectMemberController
);

export default router;
