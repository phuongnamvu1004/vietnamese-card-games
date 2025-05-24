import express from "express";
import cors from "cors";
import { testDatabaseConnection } from "./database"; // Updated to use `testDatabaseConnection`
import cookieParser from "cookie-parser";
import { log } from "./lib/utils";
import { config } from "dotenv";
import session from "express-session";
import { createNewSessionStore } from "./redis";
import authRouter from "./routes/auth.routes";
import userRouter from "./routes/user.routes";
import roomRouter from "./routes/room.routes";

config({ path: process.env.DOTENV_PATH || ".env.local" }); // Dynamic dotenv path

const app = express();

// Bootstrap function to initialize all dependencies
const bootstrap = async () => {
  try {
    // Test database connection
    log("Testing database connection...", "info");
    await testDatabaseConnection();
    log("Database connection successful!", "info");

    // Test Redis connection (Optional)
    log("Testing Redis connection...", "info");
    createNewSessionStore(); // Assuming this handles Redis connection issues internally
    log("Redis connection successful!", "info");

    // Middleware configuration
    app.use(cors({
      origin: process.env.FRONTEND_URL, // allow frontend to access
      credentials: true,               // allow cookies / auth
    }));

    app.use(express.json());
    app.use(cookieParser());

    // Set up session middleware with Redis
    app.use(session({
      store: createNewSessionStore(), // Use the Redis session store
      secret: process.env.SESSION_SECRET || "aStrongSecret", // Replace it with a secret from .env
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Secure cookies in production
        maxAge: 1000 * 60 * 60 * 24, // 1 day
      },
    }));

    // API routes
    app.use("/api/auth", authRouter);
    app.use("/api/user", userRouter);
    app.use("/api/room", roomRouter);

    // Start the server only after all successful initializations
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      log(`Server is listening on port ${PORT}`, "info");
    });
  } catch (error) {
    log("Server initialization failed:", error, "error");
    process.exit(1); // Exit the process on critical failure
  }
};

// Start the application
await bootstrap();