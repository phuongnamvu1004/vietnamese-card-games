import { Server, Socket } from 'socket.io';
import { nanoid } from 'nanoid';
import { Room } from '../models/room.model';
import { Card, shuffleDeck } from '../game/shared/cards';
import { getGameState, updateGameState } from '../redis/gameState';
import type { CurrentGameState, Player } from '../types/game';

export const setupRoomEvents = (io: Server, socket: Socket) => {
  /**
   * CREATE ROOM
   */
  socket.on('createRoom', async ({hostUserId, gameType, maxPlayers, otherPlayers, buyIn, valuePerPoint}, callback) => {
    try {
      const roomId = nanoid(8); // short room code like "X3P9F2GQ"

      // 1. Save room to MongoDB
      const players: string[] = [hostUserId, ...otherPlayers]; // otherPlayers is an array of user IDs
      await Room.create({
        roomId,
        hostUserId,
        gameType,
        maxPlayers,
        players,
        buyIn,
        valuePerPoint,
        gameLog: [],
      });

      let deck: Card[] = Card.createDeck();
      deck = shuffleDeck(deck);

      // 2. Init game state in Redis
      const initialState: CurrentGameState = {
        players,
        deck,
        pile: [],
        currentTurn: "",
        phase: "waiting",
        instantWinPlayers: [],
      };

      const playerList: Player[] = players.map((playerId) => ({
        id: playerId,
        socketId: "",
        hand: [],
        buyIn: 0,
        gameBalance: 0,
        state: "waitingForTurn",
      }));

      await updateGameState(roomId, initialState, playerList);

      // 3. Return roomId to client
      callback({roomId});
    } catch (err) {
      console.error('createRoom error:', err);
      callback({error: 'Failed to create room'});
    }
  });

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

      // TODO:
      // if (gameState.players.length >= 4) {
      //   callback({ error: 'Room is full' });
      //   return;
      // }

      // // 3. Add player to game state
      // gameState.players.push({
      //   id: userId,
      //   name: playerName,
      //   socketId: socket.id,
      //   hand: [],
      //   gameBalance: 0,
      //   state: 'waitingForTurn',
      // });

      // await updateGameState(roomId, gameState);

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
