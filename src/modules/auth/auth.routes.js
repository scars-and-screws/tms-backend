import { Router } from "express";
import {
  authenticate,
  requireVerifiedEmail,
  validate,
} from "../../core/middleware/index.js";

import {
  registerController,
  loginController,
  refreshController,
  logoutAllController,
  logoutController,
  getSessionsController,
  terminateSessionController,
  registerSchema,
  loginSchema,
  terminateSessionSchema,
} from "./index.js";

import { verificationRoutes } from "./verification/index.js";
import { passwordResetRoutes } from "./password-reset/index.js";
import {
  verifyTwoFactorLoginController,
  verifyTwoFactorLoginSchema,
  twoFactorRoutes,
} from "./two-factor/index.js";

const router = Router();

// PUBLIC AUTH ROUTES
router.post("/register", validate(registerSchema), registerController);
router.post("/login", validate(loginSchema), loginController);
router.post("/refresh", refreshController);

// PASSWORD RESET (PUBLIC)
router.use("/password-reset", passwordResetRoutes);

// 2FA LOGIN VERIFICATION (PUBLIC)
router.post(
  "/two-factor/verify",
  validate(verifyTwoFactorLoginSchema),
  verifyTwoFactorLoginController
);

// PROTECTED AUTH ROUTES
router.use(authenticate);
// SESSION MANAGEMENT ROUTES
router.post("/logout", logoutController);
router.post("/logout-all", logoutAllController);

router.get("/sessions", getSessionsController);

router.delete(
  "/sessions/:sessionId",
  validate(terminateSessionSchema),
  terminateSessionController
);

// EMAIL VERIFICATION ROUTES
router.use("/email", verificationRoutes);

// TWO-FACTOR AUTHENTICATION ROUTES
router.use("/two-factor", requireVerifiedEmail, twoFactorRoutes);

export default router;
