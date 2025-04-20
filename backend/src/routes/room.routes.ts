import express from 'express';
import { protectRoute } from "../middleware/auth.middleware";
import { createNewRoom } from "../controllers/room.controller";

const router = express.Router();

router.post("/create-room", protectRoute, createNewRoom);

export default router;