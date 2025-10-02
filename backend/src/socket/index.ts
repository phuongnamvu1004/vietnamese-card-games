// src/sockets/index.ts
import { Server } from "socket.io";
import { socketAuth } from "../middlewares/socket-auth.middleware";
import { setupRoomEvents } from "./events/room.events";
import { setupGameEvents } from "./events/game.events";
import { log } from "../lib/utils/logger";

let ioInstance: Server;

export const initSocketServer = (io: Server) => {
  ioInstance = io;
  io.use(socketAuth);

  io.on("connection", (socket) => {
    const userId: number = socket.data.userId;
    log(`Socket connected: ${socket.id} (user:${userId})`, "info");

    setupRoomEvents(io, socket);
    setupGameEvents(io, socket);

    socket.on("disconnect", () => {
      log(`Socket disconnected: ${socket.id} (user:${userId})`, "info");
    });
  });
};

export const getIo = () => {
  if (!ioInstance) throw new Error("Socket.io has not been initialized");
  return ioInstance;
};