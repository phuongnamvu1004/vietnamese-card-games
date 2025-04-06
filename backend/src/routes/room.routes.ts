import express from 'express';
import { protectRoute } from "../middleware/auth.middleware";
import { createNewRoom, joinRoom } from "../controllers/room.controller";

const router = express.Router();

router.post("/create-room", protectRoute, createNewRoom);
router.post("/join-room", protectRoute, joinRoom);

export default router;