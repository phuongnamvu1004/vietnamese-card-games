import { Request, Response } from "express";
import { createRoom, createRoomPlayer } from "../repositories/room.repository";
import { generateRoomId, makeJoinTicket } from "../lib/utils/generators";
import { log } from "../lib/utils/logger";
import { toError } from "../lib/utils/errors-handlers";
import { findUserByEmail } from "../repositories/user.repository";
import { CurrentGameState } from "../types/game";
import { getGameState, createGameState } from "../databases/redis/game-state";

type CreateRoomRequest = {
  gameType: "sam" | "phom";
  maxPlayers: number;
  buyIn: number;
  betUnit: number;
  players: string[]; // player emails
}

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
    }: CreateRoomRequest = req.body;

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

    // TODO: Send invitations to players (out of scope for this controller)

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
    if (newRoom) log("Room created successfully:", roomId, "info");

    // TODO: Handle invitation statuses (pending, accepted, declined)
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

    // TODO: Fix success response to include necessary room info, game type and invitations detail
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

export const createInvitations = (req: Request, res: Response) => {
  try {
    const { roomId } = req.params as { roomId: string };
    const { inviteeIds = [], expiresInMinutes = 30 } = (req.body ?? {}) as {
      inviteeIds: number[];
      expiresInMinutes?: number;
    };

    if (!Array.isArray(inviteeIds) || inviteeIds.length === 0) {
      return res.status(400).json({ message: "inviteeIds required" });
    }

    // TODO: authorize inviter (req.user.id), capacity check, upsert room_players + room_invitations
    const gameState = getGameState(roomId);
    if (!gameState) {
      return res.status(404).json({ message: "Room not found" });
    }

    // TODO: emit socket event 'room:invited' to each online invitee



    const invitations = inviteeIds.map((uid) => {
      const expiresAt = new Date(Date.now() + expiresInMinutes * 60 * 1000);
      const joinTicket = makeJoinTicket(roomId, uid); // 🔑 generate a short-lived ticket

      return {
        userId: uid,
        inviteId: "TBD", // TODO: replace with DB id after insert
        expiresAt: expiresAt.toISOString(),
        joinTicket, // include token in response
      };
    });

    return res.status(201).json({ roomId, invitations });
  } catch (error: unknown) {
    const err = toError(error);
    log("Error in createInvitations controller: ", err.message || "Internal server error", "error");
    return res.status(500).json({ message: err.message || "Failed to create invitations"});
  }
}