import { Server, Socket } from "socket.io";
import { handlePlayCard } from "./handlers/game/play-card.handler";
import { handleStartGame } from "./handlers/game/start-game.handler";

export const setupGameEvents = (io: Server, socket: Socket): void => {
  socket.on("playCard", handlePlayCard(io, socket));
  socket.on("startGame", handleStartGame(io, socket));
};
