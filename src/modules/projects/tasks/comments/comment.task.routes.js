import { Router } from "express";
import {
  createCommentController,
  listCommentsController,
} from "./comment.controller.js";

import {
  createCommentSchema,
  listCommentsSchema,
} from "./comment.validation.js";

import {
  validate,
  requireTaskAccess,
} from "../../../../core/middleware/index.js";
