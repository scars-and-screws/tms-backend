import { Router } from "express";
import {
  enableTwoFactorLoginController,
  disableTwoFactorLoginController,
} from "./index.js";

const router = Router();

router.post("/enable", enableTwoFactorLoginController);
router.post("/disable", disableTwoFactorLoginController);

export default router;
