import { Response } from "express";
import { SafeUser } from "../../mappers/user.mapper";
import { UserStatisticsSam, UserStatisticsPhom } from "../../entities/user-statistics";

export type UpdateProfileServiceInput = {
  userId: number;
  profilePic: string;
}

export type GetUserStatisticsServiceInput = {
  userId: number;
}

export type GetUserStatisticsServiceOutput = {
  samData: UserStatisticsSam;
  phomData: UserStatisticsPhom;
}

export interface IUserService {
  updateProfile(input: UpdateProfileServiceInput, res: Response): Promise<SafeUser | undefined>;

  getUserStatistics(input: GetUserStatisticsServiceInput, res: Response): Promise<GetUserStatisticsServiceOutput | undefined>;
}