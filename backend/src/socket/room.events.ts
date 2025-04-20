import { Server, Socket } from 'socket.io';
import { getGameState, updateGameState } from '../redis/gameState';
import { createRoomPlayer, findRoomByRoomId, getPlayersFromRoom, updateRoom } from '../models/room.model';
import { log, toError } from '../lib/utils';

export const setupRoomEvents = (io: Server, socket: Socket) => {
  socket.on('joinRoom', async ({roomId, userId, playerName}, callback) => {
    try {
      const room = await findRoomByRoomId(roomId);
      if (!room) {
        log("Room not found", "warn");
        callback({error: "Room not found"});
        return;
      }

      const currentPlayers: string[] | null = await getPlayersFromRoom(room.id);
      if (currentPlayers && currentPlayers.length >= room.maxPlayers) {
        log("Room is full", "warn");
        callback({error: "Room is full"});
        return;
      }

      const alreadyJoined = currentPlayers?.includes(userId);
      if (alreadyJoined) {
        log("User already in the room", "warn");
        callback({error: "User already in the room"});
        return;
      }

      // Join Socket.IO room
      socket.join(roomId);

      // Update game state in Redis
      const gameState = await getGameState(roomId);
      if (!gameState) {
        callback({error: "Game state not found or expired"});
        return;
      }

      gameState.players.push({
        id: userId,
        name: playerName,
        socketId: socket.id,
        hand: [],
        gameBalance: 0,
        state: 'waitingForTurn',
      });

      await updateGameState(roomId, gameState);

      // Update DB room player list (optional redundancy for persistence)
      room.players.push(userId);
      await updateRoom(room);
      await createRoomPlayer({roomId: room.id, userId});

      log("Add user", userId, "to room:", room.id, "info");

      // Notify all clients in the room
      io.to(roomId).emit("roomUpdate", gameState);

      // Respond to the joining player
      callback({success: true});
    } catch (error: unknown) {
      const err = toError(error);
      console.error("joinRoom error:", err);
      callback({error: err.message || "Internal server error"});
    }
  });
};
