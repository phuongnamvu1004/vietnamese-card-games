import express from "express";
import { connectDB } from "./lib/db";
import cookieParser from "cookie-parser";
import log from "./lib/utils";
import { config } from "dotenv";
config({ path: ".env.local" });

import authRouter from "./routes/auth.routes"

const app = express()

connectDB();

// Middleware to parse JSON
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);

app.listen(process.env.PORT || 3000, () => {
  log("Server is listening on port 3000", "info");
})