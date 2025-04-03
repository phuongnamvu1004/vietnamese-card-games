import {Server} from "socket.io";
import {setupRoomEvents} from "./room.events";
import {setupGameEvents} from "./game.events";
import {log} from "../lib/utils";

export const initSocketServer = (io: Server) => {
  io.on('connection', (socket) => {
    log(`Socket connected: ${socket.id}`, 'info');

    setupRoomEvents(io, socket);
    setupGameEvents(io, socket);

    socket.on('disconnect', () => {
      log(`Socket disconnected: ${socket.id}`, 'info');
    });
  });
};
