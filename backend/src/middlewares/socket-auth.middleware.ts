// src/middleware/socketAuth.ts
import { Socket } from "socket.io";
import jwt from "jsonwebtoken";
import { findUserById } from "../repositories/user.repository";
import type { JwtPayload as StdJwtPayload } from "jsonwebtoken";
import { log } from "../lib/utils/logger";

type JwtPayload = StdJwtPayload & { sub: string | number }; // allow both; we'll coerce to number

export async function socketAuth(socket: Socket, next: (err?: Error) => void) {
  try {
    // 1) Get token from the client through handshake (the client sets io.connect({ auth: { token } }))
    const token = socket.handshake.auth?.token
      || (typeof socket.handshake.headers.authorization === "string"
        ? socket.handshake.headers.authorization.replace("Bearer ", "")
        : undefined);

    if (!token) return next(new Error("Unauthorized: missing token"));

    // 2) Verify & decode (jsonwebtoken returns string | JwtPayload)
    const decodedRaw = jwt.verify(token, process.env.JWT_SECRET!);
    if (typeof decodedRaw === "string") {
      return next(new Error("Unauthorized: invalid token payload"));
    }
    const decoded = decodedRaw as JwtPayload;

    // Normalize sub → number
    const subValue = Number(decoded.sub);
    if (!Number.isFinite(subValue)) {
      return next(new Error("Unauthorized: invalid subject"));
    }

    // 3) (Optional but good) Check user exists/active in DB
    const user = await findUserById(subValue);
    if (!user) return next(new Error("Unauthorized: user not found"));

    // 4) Attach and join a per-user room
    socket.data.userId = user.id;
    socket.join(`user:${user.id}`);

    next();
  } catch (error) {
    log("Error in socketAuth middleware:", (error as Error).message, "error");
    next(new Error("Unauthorized"));
  }
}