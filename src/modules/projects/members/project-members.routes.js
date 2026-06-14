import { Router } from "express";
import { validate } from "../../../shared/middleware/index.js";

import {
  requireProjectRole,
  requireProjectMember,
  requireActiveProject,
} from "../middleware/index.js";

import {
  addProjectMemberController,
  listProjectMembersController,
  updateProjectMemberRoleController,
  removeProjectMemberController,
  searchProjectMembersController,
} from "./project-members.controller.js";

import {
  addProjectMemberSchema,
  updateProjectMemberRoleSchema,
  removeProjectMemberSchema,
  listProjectMembersSchema,
  searchProjectMembersSchema,
} from "./project-members.validation.js";

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

// ! SEARCH PROJECT MEMBERS (MENTIONS)
router.get(
  "/search",
  validate(searchProjectMembersSchema),
  requireProjectMember,
  searchProjectMembersController
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
