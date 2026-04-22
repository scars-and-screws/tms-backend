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
  validate(addOrganizationMemberSchema),
  requireOrganizationRole(["OWNER", "ADMIN"]),
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
  validate(updateOrganizationMemberRoleSchema),
  requireOrganizationRole(["OWNER", "ADMIN"]),
  updateOrganizationMemberRoleController
);

// REMOVE ORGANIZATION MEMBER
router.delete(
  "/:memberId",
  validate(removeOrganizationMemberSchema),
  requireOrganizationRole(["OWNER", "ADMIN"]),
  removeOrganizationMemberController
);

export default router;
