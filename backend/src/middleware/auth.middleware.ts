import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { config } from "dotenv";
import log from "../lib/utils.js";

config({ path: ".env.local" });

import User from "../models/user.model.js";

export const protectRoute = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    log("Cookies received:", req.cookies, "info"); // Use the custom logger
    const token = req.cookies.jwt;

    if (!token) {
      log("Unauthorized access attempt - No token provided", "warn");
      res.status(401).json({ message: "Unauthorized - No Token Provided" });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!);

    if (!decoded || typeof decoded === "string") {
      log("Unauthorized access attempt - Invalid token", "warn");
      res.status(401).json({ message: "Unauthorized - Invalid Token" });
      return;
    }

    log("Successfully decoded token:", decoded, "info"); 

    const user = await User.findById((decoded as jwt.JwtPayload).userId).select("-password");

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    req.user = user;

    log("User authenticated successfully:", user, "info");

    next();
  } catch (error) {
    log("Error in protectRoute middleware:", (error as Error).message, "error");
    res.status(500).json({ message: "Internal server error" });
  }
};
