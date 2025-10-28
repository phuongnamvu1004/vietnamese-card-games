import { Server, Socket } from "socket.io";

export const handleLeaveRoom = (io: Server, socket: Socket) => {
  return async () => {
    /* TODO: Check current GameState to:
    * - Calculate gains = gameBalance - (total) buyIn (we can allow multiple buyIn
    * - Save game stats
    * - Remove player from the game state player list + any trace of the player left
    */

    // TODO: Update RoomPlayer table (may be check for rejoined policy)

    // TODO: Update UserStatistics (by Players' num wins/losses + instant wins map, check game.d.ts)

    // TODO: Disconnect from socket server
  }
}