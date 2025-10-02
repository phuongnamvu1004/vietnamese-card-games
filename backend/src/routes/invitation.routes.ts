import express from "express";

import { InvitationController } from "../controllers/invitation.controller";
import { protectRoute } from "../middlewares/auth.middleware";

const router = express.Router();

// For invitee to respond to an invitation
router.post("/accept-invitation", protectRoute, InvitationController.acceptInvitation);
router.post("/decline-invitation", protectRoute, InvitationController.declineInvitation);

// Invitor can cancel an invitation they sent
router.post("/cancel-invitation", protectRoute, InvitationController.cancelInvitation);

export default router;