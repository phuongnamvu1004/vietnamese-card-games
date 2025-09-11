import jwt from "jsonwebtoken";
import { config } from "dotenv";
import { Response } from "express";
import crypto from "crypto";

config({ path: ".env.local" });

export const generateToken = (userId: string, res: Response) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // MS
    httpOnly: true, // prevent XSS attacks cross-site scripting attacks
    sameSite: "strict", // CSRF attacks cross-site request forgery attacks
    secure: process.env.NODE_ENV !== "development",
  });

  return token;
};

export const generateRoomId = (length: number = 8): string => {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const JOIN_SECRET = process.env.JOIN_SECRET || "dev-join-secret";
export const makeJoinTicket = (roomId: string, userId: number) => {
  return jwt.sign(
    { roomId },
    JOIN_SECRET,
    { subject: String(userId), expiresIn: "2m", jwtid: crypto.randomUUID() }
  );
}