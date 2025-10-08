import { Request, Response } from "express";

import { InvitationService } from "../services/invitation.service";

import { invitationControllerErrorHandler } from "../lib/utils/errors-handlers";
import { getIo } from "../socket";

export const InvitationController = {
  async acceptInvitation(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const { invitorId, roomId } = req.body;

      const result = await InvitationService.acceptInvitation({ invitorId, inviteeId: userId, roomId }, getIo());
      res.status(200).json(result);
    } catch (error: unknown) {
      invitationControllerErrorHandler(error, "accept", res);
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
      invitationControllerErrorHandler(error, "decline", res);
    }
  }
  ,

  async cancelInvitation(req: Request, res: Response) {
    try {
      const invitorId = req.user!.id;
      const { inviteeId, roomId } = req.body;

      const updatedInvitation = await InvitationService.cancelInvitation({ invitorId, inviteeId, roomId }, getIo());
      res.status(200).json(updatedInvitation);
    } catch (error: unknown) {
      invitationControllerErrorHandler(error, "cancel", res);
    }
  }
}