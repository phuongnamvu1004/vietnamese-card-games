import express from "express";

import { supabase } from "../databases/supabase";

import { AuthController } from "../controllers/auth.controller";
import { protectRoute } from "../middlewares/auth.middleware";
import { UserStatisticsRepository } from "../repositories/user-statistics.repository";
import { UserRepository } from "../repositories/user.repository";
import { AuthService } from "../services/auth.service";

const router = express.Router();

const userRepo = new UserRepository(supabase);
const userStatisticsRepo = new UserStatisticsRepository(supabase);
const authService = new AuthService(userRepo, userStatisticsRepo)
const authController = new AuthController(authService);

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/logout", protectRoute, authController.logout);

router.get("/check", protectRoute, authController.checkAuth);
router.post("/refresh", authController.refresh);

export default router;
