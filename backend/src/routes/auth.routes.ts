import express from "express";

import { AuthController } from "../controllers/auth.controller";
import { protectRoute } from "../middlewares/auth.middleware";

const router = express.Router();

router.post("/signup", AuthController.signup);
router.post("/login", AuthController.login);
router.post("/logout", protectRoute, AuthController.logout);

router.get("/check", protectRoute, AuthController.checkAuth);

export default router;
