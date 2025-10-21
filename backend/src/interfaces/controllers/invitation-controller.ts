import { Request, Response } from "express";

export interface IInvitationController {
  acceptInvitation(req: Request, res: Response): Promise<void>;

  declineInvitation(req: Request, res: Response): Promise<void>;

  cancelInvitation(req: Request, res: Response): Promise<void>;
}