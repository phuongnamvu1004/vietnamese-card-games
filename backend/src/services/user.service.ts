import { Response } from "express";
import { log } from "../lib/utils/logger";
import cloudinary from "../lib/cloudinary";
import { updateUserProfilePic } from "../repositories/user.repository";
import {
  getUserStatisticsPhomByUserId,
  getUserStatisticsSamByUserId
} from "../repositories/user-statistics.repository";

export type UpdateProfileServiceInput = {
  userId: number;
  profilePic: string;
}

export type GetUserStatisticsServiceInput = {
  userId: number;
}
export const UserService = {
  async updateProfile(input: UpdateProfileServiceInput, res: Response) {
    const { userId, profilePic } = input;

    if (!profilePic) {
      log("Profile pic is required", "warn");
      res.status(400).json({ message: "Profile pic is required" });
      return;
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic);

    const updatedUser = await updateUserProfilePic(
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
  },

  async getUserStatistics(input: GetUserStatisticsServiceInput, res: Response) {
    const { userId } = input;
    const samData = await getUserStatisticsSamByUserId(userId);
    const phomData = await getUserStatisticsPhomByUserId(userId);

    if (!samData || !phomData) {
      log("Failed to retrieve user statistics", "error");
      res.status(500).json({ message: "Failed to retrieve user statistics" });
      return null;
    }

    return { samData, phomData };
  }
}