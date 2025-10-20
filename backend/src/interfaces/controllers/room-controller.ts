import { Request, Response } from "express";

export interface IRoomController {
  createNewRoom (req: Request, res: Response): Promise<void>;
}
