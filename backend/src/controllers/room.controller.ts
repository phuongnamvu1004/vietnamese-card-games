import { Request, Response } from "express";
import { generateRoomId } from "../lib/utils/generators";
import { log } from "../lib/utils/logger";
import { toError } from "../lib/utils/errors-handlers";
import { CreateRoomRequestDTO } from "../dtos/room.dto";
import { getIo } from "../socket";
import { IRoomService } from "../interfaces/services/room-service";
import { IRoomController } from "../interfaces/controllers/room-controller";

export class RoomController implements IRoomController {
  constructor(
    private readonly _roomService: IRoomService,
  ) {}

  public createNewRoom = async (req: Request, res: Response): Promise<void> => {
    try {
      const { gameType, maxPlayers, buyIn, betUnit, players }: CreateRoomRequestDTO = req.body;

      const roomId = generateRoomId();
      const hostUserId = req.user!.id;

      // TODO: When host creates room, they should join the room automatically, call socket "join-room"
      const { room, inviteeIds } = await this._roomService.createRoomWithInvitations({
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