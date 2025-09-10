import express from "express";
import { protectRoute } from "../middlewares/auth.middleware";
import { RoomController } from "../controllers/room.controller";

const router = express.Router();

// Create a new room
router.post("/create-room", protectRoute, RoomController.createNewRoom);

// Invitations routes
// router.post("/rooms/:roomId/invitations/cancel", protectRoute, cancelInvitations);
//
// // List players in a room
// router.get("/rooms/:roomId/players", protectRoute, listRoomPlayers);
//
// // List my invitations
// router.get("/me/invitations", protectRoute, listMyInvitations);

export default router;
