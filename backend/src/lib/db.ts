import mongoose from "mongoose";
import log from "./utils.js";

import { config } from "dotenv";

config({ path: ".env.local" });

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI!);
    log(`MongoDB connected: ${conn.connection.host}`, "info");
  } catch (error) {
    log("MongoDB connection error:", error, "error");
  }
};
