import { Server, Socket } from "socket.io";
import { createRoomPlayer, findRoomByRoomId, getPlayersFromRoom, updateRoom } from "../../../models/room.model";
import { log, toError } from "../../../lib/utils";
import { getGameState, updateGameState } from "../../../redis/gameState";
import { getUserById } from "../../../models/user.model";
import { CurrentGameState } from "../../../types/game";

export const handleJoinRoom = (io: Server, socket: Socket) => {
  return async (
    {
      roomId,
      userId,
      playerName,
    }: { roomId: string; userId: number; playerName: string },
    callback: (response: {
      success?: boolean;
      error?: string;
      isHost?: boolean;
      gameState?: CurrentGameState;
    }) => void
  ) => {
    try {
      const room = await findRoomByRoomId(roomId);
      if (!room) {
        log("Room not found", "warn");
        callback({ error: "Room not found" });
        return;
      }

      const currentPlayers: number[] | null = await getPlayersFromRoom(room.id);
      if (currentPlayers && currentPlayers.length >= room.maxPlayers) {
        log("Room is full", "warn");
        callback({ error: "Room is full" });
        return;
      }

      const alreadyJoined = currentPlayers?.includes(userId);
      if (alreadyJoined) {
        log("User already in the room", "warn");
        callback({ error: "User already in the room" });
        return;
      }

      const user = await getUserById(userId);
      if (!user || user.balance < room.buyIn) {
        log("User does not have enough balance", "warn");
        callback({ error: "User does not have enough balance" });
        return;
      }

      socket.join(roomId);
      socket.data.roomId = roomId;

      const gameState = await getGameState(roomId);
      if (!gameState) {
        callback({ error: "Game state not found or expired" });
        return;
      }

      gameState.players.push({
        id: userId,
        socketId: socket.id,
        name: playerName,
        hand: [],
        gameBalance: 0,
        state: "waitingForTurn",
      });

      await updateGameState(roomId, gameState);

      // Check for the case when the room creator joins the room (which has already been added to player list)
      if (!room.players.includes(userId)) {
        room.players.push(userId);
      }

      await updateRoom(room);
      await createRoomPlayer({ roomId: room.id, userId });

      log("Add user", userId, "to room:", room.id, "info");

      io.to(roomId).emit("roomUpdate", gameState);

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
