import { Request, Response } from "express";
import { log } from "../lib/utils";
import cloudinary from "../lib/cloudinary";
import { updateUserProfilePic } from "../models/user.model";
import { getUserStatisticsPhomByUserId, getUserStatisticsSamByUserId } from "../models/userStatistics.model";


export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const {profilePic} = req.body;
    const userId = req.user!.id; // ✅ Use numeric `id`

    if (!profilePic) {
      log("Profile pic is required", "warn");
      res.status(400).json({message: "Profile pic is required"});
      return;
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic);

    const updatedUser = await updateUserProfilePic(userId, uploadResponse.secure_url);

    if (!updatedUser) {
      log("Failed to update user profile", "error");
      res.status(500).json({message: "Failed to update user profile"});
      return;
    }

    log("User profile updated successfully:", updatedUser, "info");
    res.status(200).json(updatedUser);
  } catch (error) {
    log("error in update profile:", (error as Error).message, "error");
    res.status(500).json({message: "Internal server error"});
  }
};

export const getUserData = async (req: Request, res: Response): Promise<void> => {
  try {
    res.status(200).json(req.user);
    log("User authenticated successfully:", req.user, "info");
  } catch (error) {
    log("Error in getUserData controller:", (error as Error).message, "error");
    res.status(500).json({message: "Internal server error"});
  }
}

export const getUserStatistics = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;

    const samData = await getUserStatisticsSamByUserId(userId);
    const phomData = await getUserStatisticsPhomByUserId(userId);

    res.status(200).json({samData: samData, phomData: phomData});

  } catch (error) {
    log("Error in getUserStatistics controller:", (error as Error).message, "error");
  }
}