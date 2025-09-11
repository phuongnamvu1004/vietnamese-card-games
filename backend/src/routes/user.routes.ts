import express from "express";

import { protectRoute } from "../middlewares/auth.middleware";
import {
  updateProfile,
  getUserData,
  getUserStatistics,
} from "../controllers/user.controller";

const router = express.Router();

router.post("/update-profile", protectRoute, updateProfile);

router.get("/user-profile", protectRoute, getUserData);
router.get("/user-statistics", protectRoute, getUserStatistics);

export default router;
