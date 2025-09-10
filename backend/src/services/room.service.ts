import { createRoom, createRoomPlayer } from "../repositories/room.repository";
import { createInvitations } from "../repositories/invitation.repository";
import { findUserByEmail } from "../repositories/user.repository";
import { createGameState } from "../databases/redis/game-state";
import { log } from "../lib/utils/logger";
import { CurrentGameState } from "../types/game";
import { Server } from "socket.io";

export type CreateRoomServiceInput = {
  roomId: string;
  hostUserId: number;
  gameType: "sam" | "phom";
  maxPlayers: number;
  buyIn: number;
  betUnit: number;
  inviteeEmails: string[]; // controller passes emails; service resolves to ids
};

export const RoomService = {
  /**
   * Create a room aggregate (Redis + DB + room_players) and return the room plus invitee IDs.
   * NOTE: Wrap in a DB transaction if you introduce more writes that must be atomic.
   */
  async createRoomWithInvitations(input: CreateRoomServiceInput, io: Server) {
    const {
      roomId,
      hostUserId,
      gameType,
      maxPlayers,
      buyIn,
      betUnit,
      inviteeEmails
    } = input;

    /** Resolve emails → user IDs. Throws if any email is not found. */
    const resolvePlayerIds = async (emails: string[]): Promise<number[]> => {
      const ids = await Promise.all(
        emails.map(async (playerEmail) => {
          const user = await findUserByEmail(playerEmail);
          if (!user) throw new Error(`User not found for email: ${playerEmail}`);
          return user.id;
        })
      );
      return ids;
    }

    /** Build the initial game state for Redis */
    const buildInitialGameState = (gameType: "sam" | "phom", betUnit: number): CurrentGameState => {
      const base = {
        players: [],
        deck: [],
        currentTurn: "",
        lastPlayed: { socketId: "", cards: [] },
        betUnit,
        phase: "waiting" as const,
      };

      if (gameType === "sam") {
        return { ...base, gameType: "sam", instantWinPlayers: [] } as CurrentGameState;
      }
      return { ...base, gameType: "phom", phomSpecificField: undefined } as CurrentGameState;
    }

    // Resolve invitees
    const inviteeIds = await resolvePlayerIds(inviteeEmails);

    // Create Redis game state
    const gameState = buildInitialGameState(gameType, betUnit);
    await createGameState(roomId, gameState);
    log("Game state created in Redis:", roomId, "info");

    // Persist room
    const room = await createRoom({
      roomId,
      hostUserId,
      gameType,
      maxPlayers,
      buyIn,
      betUnit
    });
    if (!room) throw new Error("Failed to create room");
    log("Room created successfully:", roomId, "info");

    // room_players: host
    await createRoomPlayer({
      roomId: room.id,
      userId: hostUserId,
      status: "host",
      invitedBy: hostUserId
    });

    // Create invitations to invitees
    const invitations = await createInvitations({
      invitorId: hostUserId,
      roomId: room.id,
      inviteeIds
    });
    if (invitations && invitations.length !== inviteeIds.length) throw new Error("Failed to create all invitations");
    log("Invitations created successfully:", invitations, "info");

    const userRoom = (userId: number) => `user:${userId}`;
    // Emit socket events to invitees and host
    const payloadBase = {
      roomId: room.id,
      invitorId: hostUserId,
      gameType,
      maxPlayers,
      buyIn,
      betUnit,
    };

    // Notify each invitee in their personal room channel
    for (const inviteeId of inviteeIds) {
      const payload = { ...payloadBase, inviteeId };
      io.to(userRoom(inviteeId)).emit("invitation:created", payload);
    }

    // Notify host with a batch summary
    io.to(userRoom(hostUserId)).emit("invitation:batchCreated", {
      ...payloadBase,
      inviteeIds,
      count: inviteeIds.length,
    });

    // 5) room_players: invited
    for (const uid of inviteeIds) {
      await createRoomPlayer({
        roomId: room.id,
        userId: uid,
        status: "invited",
        invitedBy: hostUserId
      });
    }

    return { room, inviteeIds };
  },
};
