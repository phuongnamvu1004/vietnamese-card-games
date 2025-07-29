import { Request, Response } from "express";
import { createRoom, createRoomPlayer } from "../models/room.model";
import { generateRoomId, log, toError } from "../lib/utils";
import { findUserByEmail } from "../models/user.model";
import { CurrentGameState } from "../types/game";
import { createGameState } from "../redis/game-state";

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
export const createNewRoom = async (req: Request, res: Response) => {
  try {
    // Destructure and validate request body
    const {
      gameType,
      maxPlayers,
      buyIn,
      betUnit,
      players,
    }: {
      gameType: "sam" | "phom";
      maxPlayers: number;
      buyIn: number;
      betUnit: number;
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

    // Common base game state
    const baseGameState = {
      players: [],
      deck: [],
      currentTurn: "",
      lastPlayed: { socketId: "", cards: [] },
      betUnit,
      phase: "waiting" as const,
    };

    let newGameState: CurrentGameState;

    if (gameType === "sam") {
      newGameState = {
        ...baseGameState,
        gameType: "sam",
        instantWinPlayers: [],
      };
    } else {
      newGameState = {
        ...baseGameState,
        gameType: "phom",
        phomSpecificField: undefined,
      };
    }

    await createGameState(roomId, newGameState);
    log("Game state created in Redis:", roomId, "info");

    // Call createRoom to save the room
    const newRoom = await createRoom({
      roomId: roomId,
      hostUserId: hostUserId,
      gameType: gameType,
      maxPlayers: maxPlayers,
      players: playerIds,
      buyIn: buyIn,
      betUnit: betUnit,
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