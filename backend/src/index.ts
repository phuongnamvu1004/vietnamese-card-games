import express from "express";
import cors from "cors";
import { testDatabaseConnection } from "./databases/supabase"; // Updated to use `testDatabaseConnection`
import cookieParser from "cookie-parser";
import { log } from "./lib/utils/logger";
import { config } from "dotenv";
import session from "express-session";
import { createNewSessionStore } from "./databases/redis";

// Routes
import authRouter from "./routes/auth.routes";
import userRouter from "./routes/user.routes";
import roomRouter from "./routes/room.routes";
import invitationRouter from "./routes/invitation.routes";

// Socket.io
import http from "http";
import { Server } from "socket.io";
import { initSocketServer } from "./socket";

config({ path: process.env.DOTENV_PATH || ".env.local" }); // Dynamic dotenv path

const app = express();

// Bootstrap function to initialize all dependencies
const bootstrap = async () => {
  try {
    // Test database connection
    log("Testing Supabase connection...", "info");
    await testDatabaseConnection();
    log("Supabase connection successful!", "info");

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
    app.use("/api/invitation", invitationRouter);

    // Start the server only after all successful initializations
    const httpServer = http.createServer(app);

    // Create a socket.io server
    const io = new Server(httpServer, {
      cors: {
        origin: process.env.FRONTEND_URL,
        credentials: true,
      },
    });
    initSocketServer(io);

    const PORT = process.env.PORT || 3000;
    httpServer.listen(PORT, () => {
      log(`Server is listening on port ${PORT}`, "info");
    });
  } catch (error) {
    log("Server initialization failed:", error, "error");
    process.exit(1); // Exit the process on critical failure
  }
};

// Start the application
await bootstrap();