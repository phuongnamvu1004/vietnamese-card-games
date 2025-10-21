import { Request, Response } from "express";
import { invitationControllerErrorHandler } from "../lib/utils/errors-handlers";
import { getIo } from "../socket";
import { IInvitationService } from "../interfaces/services/invitation-service";
import { IInvitationController } from "../interfaces/controllers/invitation-controller";

export class InvitationController implements IInvitationController {
  constructor(
    private readonly _invitationService: IInvitationService,
  ) {}

  public acceptInvitation = async (req: Request, res: Response) => {
    try {
      const userId = req.user!.id;
      const { invitorId, roomId } = req.body;

      const result = await this._invitationService.acceptInvitation({ invitorId, inviteeId: userId, roomId }, getIo());
      res.status(200).json(result);
    } catch (error: unknown) {
      invitationControllerErrorHandler(error, "accept", res);
    }
  };

  public declineInvitation = async (req: Request, res: Response) => {
    try {
      const userId = req.user!.id;
      const { invitorId, roomId } = req.body;

      const updatedInvitation = await this._invitationService.declineInvitation({
        invitorId,
        inviteeId: userId,
        roomId
      }, getIo());
      res.status(200).json(updatedInvitation);
    } catch (error: unknown) {
      invitationControllerErrorHandler(error, "decline", res);
    }
  };

  public cancelInvitation = async (req: Request, res: Response) => {
    try {
      const invitorId = req.user!.id;
      const { inviteeId, roomId } = req.body;

      const updatedInvitation = await this._invitationService.cancelInvitation({ invitorId, inviteeId, roomId }, getIo());
      res.status(200).json(updatedInvitation);
    } catch (error: unknown) {
      invitationControllerErrorHandler(error, "cancel", res);
    }
  };
}