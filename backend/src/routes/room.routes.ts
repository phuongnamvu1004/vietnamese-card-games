import express from "express";
import { protectRoute } from "../middleware/auth.middleware";
import {
  createNewRoom,
  createInvitations,
  // acceptInvitation,
  // declineInvitation,
  // cancelInvitations,
  // listRoomPlayers,
  // listMyInvitations,
} from "../controllers/room.controller";

const router = express.Router();

// Create a new room
router.post("/create-room", protectRoute, createNewRoom);

// Invitations routes
router.post("/rooms/:roomId/invitations", protectRoute, createInvitations);
// router.post("/rooms/:roomId/invitations/:inviteId/accept", protectRoute, acceptInvitation);
// router.post("/rooms/:roomId/invitations/:inviteId/decline", protectRoute, declineInvitation);
// router.post("/rooms/:roomId/invitations/cancel", protectRoute, cancelInvitations);
//
// // List players in a room
// router.get("/rooms/:roomId/players", protectRoute, listRoomPlayers);
//
// // List my invitations
// router.get("/me/invitations", protectRoute, listMyInvitations);

export default router;
