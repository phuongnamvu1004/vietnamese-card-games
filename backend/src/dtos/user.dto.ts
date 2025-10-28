import { SafeUser } from "../mappers/user.mapper";
import { UserStatisticsPhom, UserStatisticsSam } from "../entities/user-statistics";

export type CreateUserRequestDTO = {
  email: string;
  fullName: string;
  password: string;
}

export type CreateUserRepoDTO = {
  email: string;
  fullName: string;
  hashedPassword: string;
}

export type CreateUserResponseDTO = {
  id: number;
  fullName: string;
  email: string;
  profilePic: string;
  balance: number;
}

export type LoginUserResponseDTO = {
  id: number;
  fullName: string;
  email: string;
  profilePic: string;
  balance: number;
}

export type UpdateProfileResponseDTO = {
  user: SafeUser;
  message: string;
}

export type GetUserStatisticsResponseDTO = {
  stats: {
    samData: UserStatisticsSam; // Replace 'any' with actual type
    phomData: UserStatisticsPhom; // Replace 'any' with actual type
  };
  message: string;
}