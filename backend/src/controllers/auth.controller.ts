import { Request, Response } from "express";
import bcrypt from "bcryptjs";

import { generateToken, log } from "../lib/utils";

import { createUser, findUserByEmail } from "../models/user.model";
import { initializeUserStatisticsPhom, initializeUserStatisticsSam } from "../models/userStatistics.model";

export const signup = async (req: Request, res: Response): Promise<void> => {
  const {fullName, email, password} = req.body;

  try {
    if (!fullName || !email || !password) {
      log("All fields are required", "warn");
      res.status(400).json({message: "All fields are required"});
      return;
    }

    if (password.length < 6) {
      log("Password must be at least 6 characters", "warn");
      res.status(400).json({message: "Password must be at least 6 characters"});
      return;
    }

    const user = await findUserByEmail(email);

    if (user) {
      log("Email already exists", "warn");
      res.status(400).json({message: "Email already exists"});
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await createUser({
      fullName,
      email,
      password: hashedPassword,
      profilePic: "", // default profile pic
    });

    await initializeUserStatisticsSam(newUser!.id);
    await initializeUserStatisticsPhom(newUser!.id);

    if (!newUser) {
      log("Invalid user data", "warn");
      res.status(400).json({message: "Invalid user data"});
      return;
    }

    // generate jwt token
    generateToken(newUser.id.toString(), res);

    log("User created successfully:", newUser, "info");

    res.status(201).json({
      id: newUser.id,
      fullName: newUser.fullName,
      email: newUser.email,
      profilePic: newUser.profilePic,
    });
  } catch (error) {
    log("Error in signup controller", (error as Error).message, "error");
    res.status(500).json({message: "Internal Server Error"});
  }
};


export const login = async (req: Request, res: Response): Promise<void> => {
  const {email, password} = req.body;

  try {
    const user = await findUserByEmail(email);

    if (!user) {
      log("Invalid credentials", "warn");
      res.status(400).json({message: "Invalid credentials"});
      return;
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      log("Invalid credentials", "warn");
      res.status(400).json({message: "Invalid credentials"});
      return;
    }

    generateToken(user.id.toString(), res);

    log("User logged in successfully:", user, "info");

    res.status(200).json({
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    log("Error in login controller", (error as Error).message, "error");
    res.status(500).json({message: "Internal Server Error"});
  }
};

export const logout = (_req: Request, res: Response): void => {
  try {
    res.cookie("jwt", "", {maxAge: 0});
    log("User logged out successfully", "info");
    res.status(200).json({message: "Logged out successfully"});
  } catch (error) {
    log("Error in logout controller", (error as Error).message, "error");
    res.status(500).json({message: "Internal Server Error"});
  }
};

export const checkAuth = (req: Request, res: Response): void => {
  try {
    res.status(200).json(req.user);
    log("User authenticated successfully:", req.user, "info");
  } catch (error) {
    log("Error in checkAuth controller", (error as Error).message, "error");
    res.status(500).json({message: "Internal Server Error"});
  }
};