import { Server, Socket } from "socket.io";
import { handlePlayCard } from "./handlers/game/playCard.handler";
import { handleStartGame } from "./handlers/game/startGame.handler";

export const setupGameEvents = (io: Server, socket: Socket): void => {
  socket.on("playCard", handlePlayCard(io, socket));
  socket.on("startGame", handleStartGame(io, socket));
};
