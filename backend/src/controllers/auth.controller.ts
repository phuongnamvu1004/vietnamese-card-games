import { Request, Response } from "express";
import { log } from "../lib/utils/logger";
import { CreateUserRequestDTO, CreateUserResponseDTO, LoginUserResponseDTO } from "../dtos/user.dto";
import { AuthService } from "../services/auth.service";
import { toError } from "../lib/utils/errors-handlers";
import { IAuthController } from "../interfaces/controllers/auth-controller";

export class AuthController implements IAuthController{
  constructor(
    private readonly _authService: AuthService,
  ) {}

  public signup = async (req: Request, res: Response): Promise<void> => {
    const { fullName, email, password }: CreateUserRequestDTO = req.body;

    try {
      const newUser = await this._authService.signup({ fullName, email, password }, res);

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
  };

  public login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    try {
      const user = await this._authService.login({ email, password }, res);

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
  }

  public logout = (_req: Request, res: Response): void => {
    try {
      this._authService.logout(res);
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
  };

  public checkAuth = (req: Request, res: Response): void => {
    try {
      res.status(200).json(req.user);
      log("User authenticated successfully:", req.user, "info");
    } catch (error: unknown) {
      const err = toError(error);
      log(`Error in checkAuth controller:`, err.message || "Internal server error", "error");
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  public refresh = (req: Request, res: Response): void => {
    try {
      const token = req.cookies?.jwt;
      if (!token) {
        res.status(401).json({ message: "No token cookie" });
        return;
      }
      res.status(200).json({ accessToken: token });
      log("Access token refreshed successfully", "info");
    } catch (error: unknown) {
      const err = toError(error);
      log(`Error in refresh controller:`, err.message || "Internal server error", "error");
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
}






