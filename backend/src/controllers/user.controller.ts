import { Request, Response } from "express";
import { log } from "../lib/utils/logger";
import { UserService } from "../services/user.service";
import { GetUserStatisticsResponseDTO, UpdateProfileResponseDTO } from "../dtos/user.dto";

export const UserController = {
  async updateProfile(
    req: Request,
    res: Response,
  ): Promise<void> {
    try {
      const { profilePic } = req.body;
      const userId = req.user!.id; // ✅ Use numeric `id`

      const updatedUser = await UserService.updateProfile({ userId, profilePic }, res);
      if (!updatedUser) {
        return;
      }

      const updateProfileResponse: UpdateProfileResponseDTO = {
        user: updatedUser,
        message: "Profile updated successfully",
      }
      log("User profile updated successfully:", updatedUser, "info");
      res.status(200).json(updateProfileResponse);
    } catch (error) {
      log("error in update profile:", (error as Error).message, "error");
      res.status(500).json({ message: "Internal server error" });
    }
  },

  async getUserData(
    req: Request,
    res: Response,
  ): Promise<void> {
    try {
      log("User authenticated successfully:", req.user, "info");
      res.status(200).json(req.user);
    } catch (error) {
      log("Error in getUserData controller:", (error as Error).message, "error");
      res.status(500).json({ message: "Internal server error" });
    }
  },

  async getUserStatistics(
    req: Request,
    res: Response,
  ): Promise<void> {
    try {
      const userId = req.user!.id;

      const stats = await UserService.getUserStatistics({ userId }, res);
      if (!stats) {
        return;
      }

      const { samData, phomData } = stats;

      const getUserStatisticsResponse: GetUserStatisticsResponseDTO = {
        stats: {
          samData,
          phomData
        },
        message: "User statistics retrieved successfully",
      }

      res.status(200).json(getUserStatisticsResponse);
    } catch (error) {
      log(
        "Error in getUserStatistics controller:",
        (error as Error).message,
        "error",
      );
    }
  }
};




