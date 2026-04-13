import { Router } from "express";
import {
  enableTwoFactorLoginController,
  disableTwoFactorLoginController,
} from "./twoFactor.controller.js";

const router = Router();

router.post("/enable", enableTwoFactorLoginController);
router.post("/disable", disableTwoFactorLoginController);

export default router;
