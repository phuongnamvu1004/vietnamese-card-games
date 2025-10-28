import express from "express";

import { InvitationController } from "../controllers/invitation.controller";
import { protectRoute } from "../middlewares/auth.middleware";
import { supabase } from "../databases/supabase";
import { RoomRepository } from "../repositories/room.repository";
import { InvitationRepository } from "../repositories/invitation.repository";
import { InvitationService } from "../services/invitation.service";
import { InvitationGuardService } from "../services/invitation-guard.service";

const router = express.Router();

const roomRepo = new RoomRepository(supabase);
const invitationRepo = new InvitationRepository(supabase);
const invitationGuardService = new InvitationGuardService(invitationRepo);
const invitationService = new InvitationService(roomRepo, invitationRepo, invitationGuardService);
const invitationController = new InvitationController(invitationService);

// For invitee to respond to an invitation
router.post("/accept-invitation", protectRoute, invitationController.acceptInvitation);
router.post("/decline-invitation", protectRoute, invitationController.declineInvitation);

// Invitor can cancel an invitation they sent
router.post("/cancel-invitation", protectRoute, invitationController.cancelInvitation);

export default router;