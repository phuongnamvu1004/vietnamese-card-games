import { Server, Socket } from "socket.io";
import { createGameState, getGameState } from "../../../redis/gameState";
import { findRoomByRoomId, updateRoom } from "../../../models/room.model";
import { log, toError } from "../../../lib/utils";
// import { generateDeck, shuffleDeck } from "../../../lib/cards";
import { Player } from "../../../types/game";

// This is only called when all players are ready and the host clicks "Start Game"
export const handleStartGame = (io: Server, socket: Socket) => {
  return async (
    { roomId }: { roomId: string },
    callback: (response: { success?: boolean; error?: string }) => void
  ) => {
    try {
      // Check if the game already started (via Redis)
      const existingState = await getGameState(roomId);
      if (existingState) {
        callback({ error: "Game already started." });
        return;
      }

      // Find room in DB
      const room = await findRoomByRoomId(roomId);
      if (!room) {
        callback({ error: "Room not found." });
        return;
      }

      // Check player count
      const playersInRoom = room.players;
      if (!playersInRoom || playersInRoom.length < 2) {
        callback({ error: "At least 2 players are required to start the game." });
        return;
      }

      // Prepare players for game state
      const gamePlayers: Player[] = playersInRoom.map((userId) => ({
        id: userId,
        name: "",         // TODO: fetch player name if needed
        socketId: "",     // TODO: optionally map socketId here if tracked
        hand: [],
        gameBalance: 0,
        state: "waitingForTurn",
      }));

      /// TODO: FIX THE BELOW COMMENTED LINES

      // // Shuffle deck
      // const deck = shuffleDeck(generateDeck(room.gameType));
      //
      // // Choose first player (simple round-robin: first in list)
      // const currentTurn = gamePlayers[0].socketId;
      //
      // // Build game state object
      // const gameState: CurrentGameState = {
      //   players: gamePlayers,
      //   deck,
      //   currentTurn,
      //   lastPlayed: {socketId: "", cards: []},
      //   betUnit: room.betUnit,
      //   phase: "playing",
      //   gameType: room.gameType,
      //   ...(room.gameType === "sam"
      //     ? {instantWinPlayers: []}
      //     : {phomSpecificField: undefined}),
      // };

      // Save game state in Redis
      await createGameState(roomId, gameState);

      // Mark room as online in DB
      room.isOnline = true;
      await updateRoom(room);

      // Notify all players
      io.to(roomId).emit("gameStarted", gameState);
      callback({ success: true });
    } catch (error: unknown) {
      const err = toError(error);
      log("startGame error", err.message, "error");
      callback({ error: err.message || "Internal server error" });
    }
  };
};
