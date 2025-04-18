import { Server, Socket } from 'socket.io';
import { getGameState, updateGameState } from '../redis/gameState';

export const setupRoomEvents = (io: Server, socket: Socket) => {
  /**
   * JOIN ROOM
   */
  socket.on('joinRoom', async ({roomId, userId, playerName}, callback) => {
    try {
      socket.join(roomId);

      // 1. Load current game state from Redis
      const gameState = await getGameState(roomId);

      // 2. Check room status
      if (!gameState) {
        callback({error: 'Room not found or expired'});
        return;
      }

      if (gameState.players.length >= 4) {
        callback({error: 'Room is full'});
        return;
      }

      // 3. Add player to game state
      gameState.players.push({
        id: userId,
        name: playerName,
        socketId: socket.id,
        hand: [],
        gameBalance: 0,
        state: 'waitingForTurn',
      });

      await updateGameState(roomId, gameState);

      // 4. Notify players in the room
      io.to(roomId).emit('roomUpdate', gameState);

      // 5. Respond to joining player
      callback({success: true});
    } catch (err) {
      console.error('joinRoom error:', err);
      callback({error: 'Failed to join room'});
    }
  });
};
