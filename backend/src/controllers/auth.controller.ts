import { generateToken } from "../lib/utils";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary";
import log from "../lib/utils";

import { Request, Response } from "express";

import User from "../models/user.model";

export const signup = async (req: Request, res: Response): Promise<void> => {
  const { fullName, email, password } = req.body;
  try {
    if (!fullName || !email || !password) {
      log("All fields are required", "warn");
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    if (password.length < 6) {
      log("Password must be at least 6 characters", "warn");
      res.status(400).json({ message: "Password must be at least 6 characters" });
      return;
    }

    const user = await User.findOne({ email });

    if (user) {
      log("Email already exists", "warn");
      res.status(400).json({ message: "Email already exists" });
      return;
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      // generate jwt token here
      generateToken(newUser._id.toString(), res);
      await newUser.save();

      log("User created successfully:", newUser, "info");

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    } else {
      log("Invalid user data", "warn");
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    log("Error in signup controller", (error as Error).message, "error");
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      log("Invalid credentials", "warn");
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    const isPasswordCorrect = await bcrypt.compare(password, user!.password);
    if (!isPasswordCorrect) {
      log("Invalid credentials", "warn");
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    generateToken(user!._id.toString(), res);

    log("User logged in successfully:", user, "info");

    res.status(200).json({
      _id: user!._id,
      fullName: user!.fullName,
      email: user!.email,
      profilePic: user!.profilePic,
    });
  } catch (error) {
    log("Error in login controller", (error as Error).message, "error");
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const logout = (_req: Request, res: Response): void => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    log("User logged out successfully", "info");
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    log("Error in logout controller", (error as Error).message, "error");
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { profilePic } = req.body;
    const userId = req.user?._id;

    if (!profilePic) {
      log("Profile pic is required", "warn");
      res.status(400).json({ message: "Profile pic is required" });
      return;
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    );

    log("User profile updated successfully:", updatedUser, "info");

    res.status(200).json(updatedUser);
  } catch (error) {
    log("error in update profile:", error, "error");
    res.status(500).json({ message: "Internal server error" });
  }
};

export const checkAuth = (req: Request, res: Response): void => {
  try {
    res.status(200).json(req.user);
    log("User authenticated successfully:", req.user, "info");
  } catch (error) {
    log("Error in checkAuth controller", (error as Error).message, "error");
    res.status(500).json({ message: "Internal Server Error" });
  }
};