import { Request, Response } from "express";

export interface IAuthController {
  signup(req: Request, res: Response): Promise<void>;
  login(req: Request, res: Response): Promise<void>;
  logout(_req: Request, res: Response): void;
  checkAuth(req: Request, res: Response): void
}