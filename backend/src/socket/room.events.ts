import { Server, Socket } from "socket.io";
import { handleJoinRoom } from "./handlers/room/joinRoom.handler";
import { handleLeaveRoom } from "./handlers/room/leaveRoom.handler";

export const setupRoomEvents = (io: Server, socket: Socket) => {
  socket.on("joinRoom", handleJoinRoom(io, socket));
  socket.on("leaveRoom", handleLeaveRoom(io, socket));
};
