import { Response } from "express";
import { log } from "../lib/utils/logger";
import cloudinary from "../lib/cloudinary";
import { IUserService, UpdateProfileServiceInput, GetUserStatisticsServiceInput, GetUserStatisticsServiceOutput } from "../interfaces/services/user-service";
import { IUserRepository } from "../interfaces/repositories/user-repository";
import { IUserStatisticsRepository } from "../interfaces/repositories/user-statistics-repository";
import { SafeUser } from "../mappers/user.mapper";


export class UserService implements IUserService {
  constructor(
    private readonly _userRepo: IUserRepository,
    private readonly _userStatsRepo: IUserStatisticsRepository,
  ) {}

  async updateProfile(input: UpdateProfileServiceInput, res: Response): Promise<SafeUser | undefined> {
    const { userId, profilePic } = input;

    if (!profilePic) {
      log("Profile pic is required", "warn");
      res.status(400).json({ message: "Profile pic is required" });
      return;
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic);

    const updatedUser = await this._userRepo.updateUserProfilePic(
      userId,
      uploadResponse.secure_url,
    );

    if (!updatedUser) {
      log("Failed to update user profile", "error");
      res.status(500).json({ message: "Failed to update user profile" });
      return;
    }

    log("User profile updated successfully:", updatedUser, "info");

    return updatedUser;
  };

  async getUserStatistics(input: GetUserStatisticsServiceInput, res: Response): Promise<GetUserStatisticsServiceOutput | undefined> {
    const { userId } = input;
    const samData = await this._userStatsRepo.getUserStatisticsSamByUserId(userId);
    const phomData = await this._userStatsRepo.getUserStatisticsPhomByUserId(userId);

    if (!samData || !phomData) {
      log("Failed to retrieve user statistics", "error");
      res.status(500).json({ message: "Failed to retrieve user statistics" });
      return;
    }

    return { samData, phomData };
  }
}