import { Server, Socket } from "socket.io";
import { getJoinedPlayersFromRoom, updateRoomPlayerStatus} from "../../../repositories/room.repository";
import { log } from "../../../lib/utils/logger";
import { toError } from "../../../lib/utils/errors-handlers";
import { getGameState, updateGameState } from "../../../databases/redis/game-state";
import { getUserById } from "../../../repositories/user.repository";
import { CurrentGameState } from "../../../types/game";
import { Room } from "../../../entities/room";

// TODO: Rework the parameters for joinRoom to be more secure:
/*
You already fetch the user and room on the server and check balances. You should not trust client-provided userId/playerName/buyIn/gameBalance. Instead:
	•	Derive userId from socket.data.userId, not from the payload
	•	Derive playerName from DB (user.name or similar)
	•	Derive buyIn from room.buyIn
	•	Compute/validate gameBalance server-side (or drop it from player state if you don’t truly need it in Redis)
 */
type JoinRoomRequest = {
  room: Room;
  userId: number;
}
export const handleJoinRoom = (io: Server, socket: Socket) => {
  return async (
    {
      room,
      userId,
    }: JoinRoomRequest,
    callback: (response: {
      success?: boolean;
      error?: string;
      isHost?: boolean;
      gameState?: CurrentGameState;
    }) => void
  ) => {
    try {

      const currentPlayers: number[] | null = await getJoinedPlayersFromRoom(room.id);
      if (!currentPlayers) {
        log("Could not retrieve current players", "error");
        callback({ error: "Could not retrieve current players" });
        return;
      }
      if (currentPlayers.length >= room.maxPlayers) { // never happens to a host since he will be the one joining the room first and maxPlayers > 1
        log("Room is full", "warn");
        callback({ error: "Room is full" });
        return;
      }

      const alreadyJoined = currentPlayers.includes(userId);
      if (alreadyJoined) {
        log("User already in the room", "warn");
        callback({ error: "User already in the room" });
        return;
      }

      const user = await getUserById(userId);
      if (!user) {
        log("User not found", "warn");
        callback({ error: "User not found" });
        return;
      }
      if (user.balance < room.buyIn) {
        log("User does not have enough balance", "warn");
        callback({ error: "User does not have enough balance" });
        return;
      }

      socket.join(room.roomId);
      // Saving roomId into socket data
      socket.data.roomId = room.roomId;

      const gameState = await getGameState(room.roomId);
      if (!gameState) {
        callback({ error: "Game state not found or expired" });
        return;
      }

      // IMPORTANT: Keep both gameBalance and buyIn to determine how much money gain/loss after the game
      gameState.players.push({
        id: userId,
        socketId: socket.id,
        name: user.fullName,
        hand: [],
        buyIn: room.buyIn,
        gameBalance: room.buyIn,
        numWins: 0,
        totalGames: 0,
        mustBeat: false,
        state: "waitingForTurn",
      });

      await updateGameState(room.roomId, gameState);

      const updatedRoomPlayerStatus = await updateRoomPlayerStatus(room.id, userId, "joined");
      if (!updatedRoomPlayerStatus) {
        log("Could not update room player status", "error");
        callback({ error: "Could not update room player status" });
        return;
      }

      log("Add user", userId, "to room:", room.id, "info");

      io.to(room.roomId).emit("roomUpdate", gameState);

      // Boolean to check if the user is the host => corresponding change in join-room UI
      const isHost = room.hostUserId === userId;

      callback({
        success: true,
        isHost,
        gameState,
      });
    } catch (error: unknown) {
      const err = toError(error);
      console.error("joinRoom error:", err);
      callback({ error: err.message || "Internal server error" });
    }
  };
};
