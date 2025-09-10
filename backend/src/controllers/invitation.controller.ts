import { Request, Response } from "express";

import { log } from "../lib/utils/logger";

import { InvitationService } from "../services/invitation.service";

import { toError } from "../lib/utils/errors-handlers";
import { getIo } from "../socket";

export const InvitationController = {
  async acceptInvitation(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const { invitorId, roomId } = req.body;

      const result = await InvitationService.acceptInvitation({ invitorId, inviteeId: userId, roomId }, getIo());
      res.status(200).json(result);
    } catch (error: unknown) {
      const err = toError(error);

      log(
        "Error in acceptInvitation controller:",
        err.message || "Internal server error",
        "error"
      );

      if (err.message === "NOT_FOUND") {
        res.status(404).json({ message: "Invitation not found" });
        return;
      }
      if (err.message?.startsWith("ALREADY_")) {
        res.status(400).json({
          message: `Invitation is already ${err.message.split("_")[1].toLowerCase()}`
        });
        return;
      }
      if (err.message === "EXPIRED") {
        res.status(400).json({ message: "Invitation has expired" });
        return;
      }
      if (err.message === "ROOM_NOT_FOUND") {
        res.status(500).json({ message: "Could not find room" });
        return;
      }
      if (err.message === "UPDATE_FAILED") {
        res.status(500).json({ message: "Could not update invitation status" });
        return;
      }

      // fallback
      res.status(500).json({ message: "Internal server error" });
    }
  },

  async declineInvitation(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const { invitorId, roomId } = req.body;

      const updatedInvitation = await InvitationService.declineInvitation({
        invitorId,
        inviteeId: userId,
        roomId
      }, getIo());
      res.status(200).json(updatedInvitation);
    } catch (error: unknown) {
      const err = toError(error);

      log(
        "Error in declineInvitation controller:",
        err.message || "Internal server error",
        "error"
      );

      if (err.message === "NOT_FOUND") {
        res.status(404).json({ message: "Invitation not found" });
        return;
      }
      if (err.message?.startsWith("ALREADY_")) {
        res.status(400).json({
          message: `Invitation is already ${err.message.split("_")[1].toLowerCase()}`
        });
        return;
      }
      if (err.message === "EXPIRED") {
        res.status(400).json({ message: "Invitation has expired" });
        return;
      }
      if (err.message === "ROOM_NOT_FOUND") {
        res.status(500).json({ message: "Could not find room" });
        return;
      }
      if (err.message === "UPDATE_FAILED") {
        res.status(500).json({ message: "Could not update invitation status" });
        return;
      }

      // fallback
      res.status(500).json({ message: "Internal server error" });
    }
  },

  async cancelInvitation(req: Request, res: Response) {
    try {
      const invitorId = req.user!.id;
      const { inviteeId, roomId } = req.body;

      const updatedInvitation = await InvitationService.cancelInvitation({ invitorId, inviteeId, roomId }, getIo());
      res.status(200).json(updatedInvitation);
    } catch (error: unknown) {
      const err = toError(error);

      log(
        "Error in cancelInvitation controller:",
        err.message || "Internal server error",
        "error"
      );

      if (err.message === "NOT_FOUND") {
        res.status(404).json({ message: "Invitation not found" });
        return;
      }
      if (err.message?.startsWith("ALREADY_")) {
        res.status(400).json({
          message: `Invitation is already ${err.message.split("_")[1].toLowerCase()}`
        });
        return;
      }
      if (err.message === "ROOM_NOT_FOUND") {
        res.status(500).json({ message: "Could not find room" });
        return;
      }
      if (err.message === "UPDATE_FAILED") {
        res.status(500).json({ message: "Could not update invitation status" });
        return;
      }

      // fallback
      res.status(500).json({ message: "Internal server error" });
    }
  }
}