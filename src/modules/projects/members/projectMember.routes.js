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
} from "./projectMember.controller.js";

import {
  addProjectMemberSchema,
  updateProjectMemberRoleSchema,
  removeProjectMemberSchema,
  listProjectMembersSchema,
} from "./projectMember.validation.js";

const router = Router({ mergeParams: true });

// ! ADD PROJECT MEMBER
router.post(
  "/",
  validate(addProjectMemberSchema),
  requireProjectMember,
  requireActiveProject,
  requireProjectRole(["ADMIN"]),
  addProjectMemberController
);

// ! LIST PROJECT MEMBERS
router.get(
  "/",
  validate(listProjectMembersSchema),
  requireProjectMember,
  listProjectMembersController
);

// ! UPDATE PROJECT MEMBER ROLE
router.patch(
  "/:memberId",
  validate(updateProjectMemberRoleSchema),
  requireProjectMember,
  requireActiveProject,
  requireProjectRole(["ADMIN"]),
  updateProjectMemberRoleController
);

// ! REMOVE PROJECT MEMBER
router.delete(
  "/:memberId",
  validate(removeProjectMemberSchema),
  requireProjectMember,
  requireActiveProject,
  requireProjectRole(["ADMIN"]),
  removeProjectMemberController
);

export default router;
