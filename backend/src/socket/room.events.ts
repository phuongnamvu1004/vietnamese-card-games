import { Server, Socket } from "socket.io";
import { handleJoinRoom } from "./handlers/room/join-room.handler";
import { handleLeaveRoom } from "./handlers/room/leave-room.handler";

export const setupRoomEvents = (io: Server, socket: Socket) => {
  socket.on("joinRoom", handleJoinRoom(io, socket));
  socket.on("leaveRoom", handleLeaveRoom(io, socket));
};
