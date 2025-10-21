import express from "express";

import { protectRoute } from "../middlewares/auth.middleware";
import { UserController } from "../controllers/user.controller";
import { UserRepository } from "../repositories/user.repository";
import { supabase } from "../databases/supabase";
import { UserStatisticsRepository } from "../repositories/user-statistics.repository";
import { UserService } from "../services/user.service";

const router = express.Router();

const userRepo = new UserRepository(supabase);
const userStatisticsRepo = new UserStatisticsRepository(supabase);
const userService = new UserService(userRepo, userStatisticsRepo)
const userController = new UserController(userService);

router.post("/update-profile", protectRoute, userController.updateProfile);

router.get("/user-profile", protectRoute, userController.getUserData);
router.get("/user-statistics", protectRoute, userController.getUserStatistics);

export default router;
