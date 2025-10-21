import { Response } from "express";
import { CreateUserResponseDTO, LoginUserResponseDTO } from "../../dtos/user.dto";
export type SignUpAuthServiceInput = { fullName: string; email: string; password: string };
export type LoginAuthServiceInput = { email: string; password: string };
export interface IAuthService {
  signup(input: SignUpAuthServiceInput, res: Response): Promise<CreateUserResponseDTO>;
  login(input: LoginAuthServiceInput, res: Response): Promise<LoginUserResponseDTO>;
  logout(res: Response): void;
}