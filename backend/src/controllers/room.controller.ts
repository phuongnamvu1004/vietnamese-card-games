import { Request, Response } from "express";
import { generateRoomId } from "../lib/utils/generators";
import { log } from "../lib/utils/logger";
import { toError } from "../lib/utils/errors-handlers";
import { CreateRoomRequestDTO } from "../dtos/room.dto";
import { RoomService } from "../services/room.service";
import { getIo } from "../socket";

export const RoomController = {
  /**
   * Creates a new game room.
   *
   * Responsibilities:
   * - Validates input and generates a unique room ID
   * - Resolves player emails to user IDs
   * - Initializes an empty gameState in Redis
   * - Saves room metadata in PostgreSQL
   * - Creates room-user associations for host and invited players
   *
   * Assumes gameplay will begin later; players will join and update gameState via socket.
   *
   * @route POST /api/room
   * @access Authenticated users only
   *
   * @param req - Express request with game setup info:
   *    {
   *      gameType: "sam" | "phom",
   *      maxPlayers: number,
   *      buyIn: number,
   *      betUnit: number,
   *      players: string[] // player emails
   *    }
   * @param res - Express response object
   */
  async createNewRoom (req: Request, res: Response) {
    try {
      const { gameType, maxPlayers, buyIn, betUnit, players }: CreateRoomRequestDTO = req.body;

      const roomId = generateRoomId();
      const hostUserId = req.user!.id;

      // TODO: When host creates room, they should join the room automatically, call socket "join-room"
      const { room, inviteeIds } = await RoomService.createRoomWithInvitations({
        roomId,
        hostUserId,
        gameType,
        maxPlayers,
        buyIn,
        betUnit,
        inviteeEmails: players,
      }, getIo());

      // (Optional) Emit to online users elsewhere after commit; controller stays thin
      res.status(201).json({
        message: "Room created and invitation records saved",
        roomId: room.id,
        inviteeIds,
      });
    } catch (error: unknown) {
      const err = toError(error);
      log(
        "Error in createNewRoom controller: ",
        err.message || "Internal server error",
        "error",
      );
      res.status(500).json({ message: err.message || "Internal server error" });
    }
  }
}