import { Server, Socket } from "socket.io";
import { getGameState, updateGameState } from "../../../databases/redis/game-state";
import { CurrentGameState } from "../../../types/game";
import { updateUserBalance } from "../../../repositories/user.repository";
import { updateSamStatsWins, updateSamStatsInstantWins } from "../../../repositories/user-statistics.repository";
import { updateRoomPlayerStatus } from "../../../repositories/room.repository";

type LeaveRoomRequest = {
  id: number; // room numeric id
  roomId: string; // generated room code
}

export const handleLeaveRoom = (io: Server, socket: Socket) => {
  return async (
    {
      id,
      roomId,
    }: LeaveRoomRequest,
    callback: (response: {
      success?: boolean;
      error?: string;
      gameState?: CurrentGameState;
    }) => void
  ) => {
    /* TODO: Check current GameState to:
    * - Calculate gains = gameBalance - (total) buyIn (we can allow multiple buyIn)
    * - Save game stats
    * - Remove player from the game state player list + any trace of the player left
    */
    const gameState = await getGameState(roomId);
    if (!gameState) {
      callback({ error: "Game state not found or expired" });
      return;
    }

    const player = gameState.players.find(player => player.socketId === socket.id);
    if (!player) {
      callback({ error: "Player not found in the game state" });
      return;
    }

    // Calculate gains = gameBalance - (total) buyIn (we can allow multiple buyIn)
    const totalGains = player.gameBalance - player.buyIn;

    // Update user table
    const user = await updateUserBalance(player.id, totalGains);
    if (!user) {
      callback({ error: "Could not update user balance" });
      return;
    }

    if (gameState.gameType === "sam") {
      // Update RoomPlayer table (maybe check for rejoined policy)
      const updatedRoomPlayerStatus = await updateRoomPlayerStatus(id, player.id, "left");
      if (!updatedRoomPlayerStatus) {
        callback({ error: "Could not update room player status" });
        return;
      }

      // Update UserStatistics (by Players' num wins/losses + instant wins map, check game.d.ts)
      const instantWinsMap = gameState.instantWinPlayers;
      const instantWins = instantWinsMap[player.id] || {};
      const { numWins, totalGames } = player;

      const updatedUserStats = await updateSamStatsWins(player.id, numWins, totalGames);
      if (!updatedUserStats) {
        callback({ error: "Could not update user stats" });
        return;
      }

      // Handle update instantWins
      const updatedInstantWins = await updateSamStatsInstantWins(player.id, instantWins);
      if (!updatedInstantWins) {
        callback({ error: "Could not update user instant wins stats" });
        return;
      }
    }

    // Remove player from the game state player list + any trace of the player left
    gameState.players = gameState.players.filter(p => p.socketId !== socket.id);

    // Update game state in Redis
    await updateGameState(roomId, gameState);

    // Disconnect from the socket room
    socket.leave(roomId);
    callback({ success: true, gameState });
  }
}