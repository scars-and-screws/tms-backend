import { Router } from "express";
import {
  addMemberController,
  addMemberSchema,
  listMembersController,
  listMembersSchema,
  updateMemberRoleController,
  updateMemberRoleSchema,
  removeMemberController,
  removeMemberSchema,
} from "./index.js";
import {
  validate,
  requireOrganizationRole,
} from "../../../core/middleware/index.js";

const router = Router({ mergeParams: true });

//  ADD MEMBER TO ORGANIZATION
router.post(
  "/",
  requireOrganizationRole(["OWNER", "ADMIN"]),
  validate(addMemberSchema),
  addMemberController
);

//  LIST MEMBERS
router.get("/", validate(listMembersSchema), listMembersController);

//  UPDATE MEMBER ROLE
router.patch(
  "/:memberId",
  requireOrganizationRole(["OWNER", "ADMIN"]),
  validate(updateMemberRoleSchema),
  updateMemberRoleController
);

// REMOVE MEMBER
router.delete(
  "/:memberId",
  requireOrganizationRole(["OWNER", "ADMIN"]),
  validate(removeMemberSchema),
  removeMemberController
);

export default router;
