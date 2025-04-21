import { Request, Response } from "express";
import { createRoom, createRoomPlayer } from "../models/room.model";
import { generateRoomId, log, toError } from "../lib/utils";
import { findUserByEmail } from "../models/user.model";

export const createNewRoom = async (req: Request, res: Response) => {
  try {
    // Destructure and validate request body
    const {
      gameType,
      maxPlayers,
      buyIn,
      valuePerPoint,
      players,
    }: {
      gameType: "sam" | "phom";
      maxPlayers: number;
      buyIn: number;
      valuePerPoint: number;
      players: string[];
    } = req.body;

    // Generate room ID
    const roomId = generateRoomId();

    const hostUserId = req.user!.id;

    // Await the resolution of all player promises
    const playerIds: number[] = await Promise.all(
      players.map(async (playerEmail) => {
        const user = await findUserByEmail(playerEmail);
        if (!user) {
          throw new Error(`User not found for email: ${playerEmail}`);
        }
        return user.id;
      }),
    );

    // Call createRoom to save the room
    const newRoom = await createRoom({
      roomId: roomId,
      hostUserId: hostUserId,
      gameType: gameType,
      maxPlayers: maxPlayers,
      players: playerIds,
      buyIn: buyIn,
      valuePerPoint: valuePerPoint,
    });
    // Send success response
    log("Room created successfully:", roomId, "info");

    // create room-user key pairs for the host and the other players
    await createRoomPlayer({
      roomId: newRoom!.id,
      userId: hostUserId,
    });
    for (const playerId of playerIds) {
      await createRoomPlayer({
        roomId: newRoom!.id,
        userId: playerId,
      });
    }

    res.status(201).json({ message: "Room created successfully", roomId });
  } catch (error: unknown) {
    const err = toError(error);
    log(
      "Error in createNewRoom controller: ",
      err.message || "Internal server error",
      "error",
    );
    res.status(500).json({ message: err.message || "Internal server error" });
  }
};
