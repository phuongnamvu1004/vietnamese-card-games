import express from "express";

import { protectRoute } from "../middlewares/auth.middleware";
import { UserController } from "../controllers/user.controller";

const router = express.Router();

router.post("/update-profile", protectRoute, UserController.updateProfile);

router.get("/user-profile", protectRoute, UserController.getUserData);
router.get("/user-statistics", protectRoute, UserController.getUserStatistics);

export default router;
