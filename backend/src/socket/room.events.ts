import { Server, Socket } from "socket.io";
import { handleJoinRoom } from "./handlers/room/joinRoom.handler";

export const setupRoomEvents = (io: Server, socket: Socket) => {
  socket.on("joinRoom", handleJoinRoom(io, socket));
};
