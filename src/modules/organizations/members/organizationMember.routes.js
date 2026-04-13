import { Router } from "express";
import {
  addOrganizationMemberSchema,
  listOrganizationMembersSchema,
  updateOrganizationMemberRoleSchema,
  removeOrganizationMemberSchema,
  addOrganizationMemberController,
  listOrganizationMembersController,
  updateOrganizationMemberRoleController,
  removeOrganizationMemberController,
} from "./index.js";
import {
  requireOrganizationRole,
  validate,
} from "../../../core/middleware/index.js";

const router = Router({ mergeParams: true });

//  ADD MEMBER TO ORGANIZATION
router.post(
  "/",
  requireOrganizationRole(["OWNER", "ADMIN"]),
  validate(addOrganizationMemberSchema),
  addOrganizationMemberController
);

//  LIST ORGANIZATION MEMBERS
router.get(
  "/",
  validate(listOrganizationMembersSchema),
  listOrganizationMembersController
);

//  UPDATE ORGANIZATION MEMBER ROLE
router.patch(
  "/:memberId",
  requireOrganizationRole(["OWNER", "ADMIN"]),
  validate(updateOrganizationMemberRoleSchema),
  updateOrganizationMemberRoleController
);

// REMOVE ORGANIZATION MEMBER
router.delete(
  "/:memberId",
  requireOrganizationRole(["OWNER", "ADMIN"]),
  validate(removeOrganizationMemberSchema),
  removeOrganizationMemberController
);

export default router;
