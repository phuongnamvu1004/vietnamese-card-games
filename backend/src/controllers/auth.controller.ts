import { Request, Response } from "express";
import { log } from "../lib/utils/logger";
import { CreateUserRequestDTO, CreateUserResponseDTO, LoginUserResponseDTO } from "../dtos/user.dto";
import { AuthService } from "../services/auth.service";

export const AuthController = {
  async signup (req: Request, res: Response): Promise<void> {
    const { fullName, email, password }: CreateUserRequestDTO = req.body;

    try {
      const newUser = await AuthService.signup({ fullName, email, password }, res);

      if (!newUser) {
        return; // Response already sent in AuthService.signup
      }

      const signupResponse: CreateUserResponseDTO = {
        id: newUser.id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic ?? "",
        balance: newUser.balance,
      };
      res.status(201).json(signupResponse);
    } catch (error) {
      log("Error in signup controller", (error as Error).message, "error");
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  async login (req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;

    try {
      const user = await AuthService.login({ email, password }, res);

      if (!user) {
        return; // Response already sent in AuthService.login
      }
      const loginResponse: LoginUserResponseDTO = {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        profilePic: user.profilePic ?? "",
        balance: user.balance,
      }

      res.status(200).json(loginResponse);
    } catch (error) {
      log("Error in login controller", (error as Error).message, "error");
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  logout (_req: Request, res: Response): void {
    try {
      AuthService.logout(res);
      res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
      log("Error in logout controller", (error as Error).message, "error");
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  checkAuth (req: Request, res: Response): void {
    try {
      res.status(200).json(req.user);
      log("User authenticated successfully:", req.user, "info");
    } catch (error) {
      log("Error in checkAuth controller", (error as Error).message, "error");
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
}






