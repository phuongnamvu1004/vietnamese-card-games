import { Request, Response } from "express";

export interface IUserController {
  updateProfile(req: Request, res: Response): Promise<void>;
  getUserData(req: Request, res: Response): void;
  getUserStatistics(req: Request, res: Response,): Promise<void>;
}