import { Request, Response } from "express";
import { log } from "../lib/utils/logger";
import { CreateUserRequestDTO, CreateUserResponseDTO, LoginUserResponseDTO } from "../dtos/user.dto";
import { AuthService } from "../services/auth.service";
import { toError } from "../lib/utils/errors-handlers";

export const AuthController = {
  async signup(req: Request, res: Response): Promise<void> {
    const { fullName, email, password }: CreateUserRequestDTO = req.body;

    try {
      const newUser = await AuthService.signup({ fullName, email, password }, res);

      const signupResponse: CreateUserResponseDTO = {
        id: newUser.id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic ?? "",
        balance: newUser.balance,
      };

      res.status(201).json(signupResponse);
    } catch (error: unknown) {
      const err = toError(error)
      log(
        `Error in signup controller:`,
        err.message || "Internal server error",
        "error"
      );

      if (err.message) {
        res.status(400).json({ message: err.message });
        return;
      }

      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  async login(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;

    try {
      const user = await AuthService.login({ email, password }, res);

      const loginResponse: LoginUserResponseDTO = {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        profilePic: user.profilePic ?? "",
        balance: user.balance,
      }

      res.status(200).json(loginResponse);
    } catch (error: unknown) {
      const err = toError(error)

      log(`Error in login controller:`, err.message || "Internal server error", "error");

      if (err.message) {
        res.status(400).json({ message: err.message });
        return;
      }

      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  logout(_req: Request, res: Response): void {
    try {
      AuthService.logout(res);
      res.status(200).json({ message: "Logged out successfully" });
    } catch (error: unknown) {
      const err = toError(error)
      log(
        `Error in logout controller:`,
        err.message || "Internal server error",
        "error"
      );
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  checkAuth(req: Request, res: Response): void {
    try {
      res.status(200).json(req.user);
      log("User authenticated successfully:", req.user, "info");
    } catch (error: unknown) {
      const err = toError(error);
      log(`Error in checkAuth controller:`, err.message || "Internal server error", "error");
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
}






