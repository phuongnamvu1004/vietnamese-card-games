import express from "express";
import { protectRoute } from "../middlewares/auth.middleware";
import { RoomController } from "../controllers/room.controller";
import { UserRepository } from "../repositories/user.repository";
import { supabase } from "../databases/supabase";
import { RoomRepository } from "../repositories/room.repository";
import { InvitationRepository } from "../repositories/invitation.repository";
import { RoomService } from "../services/room.service";

const router = express.Router();

const userRepo = new UserRepository(supabase);
const roomRepo = new RoomRepository(supabase);
const invitationRepo = new InvitationRepository(supabase);
const roomService = new RoomService(userRepo, roomRepo, invitationRepo);
const roomController = new RoomController(roomService);

// Create a new room
router.post("/create-room", protectRoute, roomController.createNewRoom);

export default router;
