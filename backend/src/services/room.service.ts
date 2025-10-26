import { createGameState } from "../databases/redis/game-state";
import { log } from "../lib/utils/logger";
import { CurrentGameState } from "../types/game";
import { Server } from "socket.io";
import { IRoomRepository } from "../interfaces/repositories/room-repository";
import { CreateRoomServiceInput, CreateRoomServiceOutput, IRoomService } from "../interfaces/services/room-service";
import { IUserRepository } from "../interfaces/repositories/user-repository";
import { IInvitationRepository } from "../interfaces/repositories/invitation-repository";

export class RoomService implements IRoomService {
  constructor(
    private readonly _userRepo: IUserRepository,
    private readonly _roomRepo: IRoomRepository,
    private readonly _invitationRepo: IInvitationRepository
  ) {}

  async createRoomWithInvitations(input: CreateRoomServiceInput, io: Server): Promise<CreateRoomServiceOutput> {
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
    const resolveHostName = async (id: number): Promise<string> => {
      const user = await this._userRepo.findUserById(id);
      if (!user) throw new Error(`User not found for id: ${id}`);
      return user.fullName;
    }

    const resolvePlayerIds = async (emails: string[]): Promise<number[]> => {
      const ids = await Promise.all(
        emails.map(async (playerEmail) => {
          const user = await this._userRepo.findUserByEmail(playerEmail);
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

    /** Helper to emit event to personal rooms */
    const userRoom = (userId: number) => `user:${userId}`;


    // Resolve invitees
    const inviteeIds = await resolvePlayerIds(inviteeEmails);

    // Create Redis game state
    const gameState = buildInitialGameState(gameType, betUnit);
    await createGameState(roomId, gameState);
    log("Game state created in Redis:", roomId, "info");

    // Persist room
    const room = await this._roomRepo.createRoom({
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
    await this._roomRepo.createRoomPlayer({
      roomId: room.id,
      userId: hostUserId,
      status: "host",
      invitedBy: hostUserId
    });

    // Create invitations to invitees
    const invitations = await this._invitationRepo.createInvitations({
      invitorId: hostUserId,
      roomId: room.id,
      inviteeIds
    });
    if (!invitations) throw new Error("Failed to create invitations");

    if (invitations.length !== inviteeIds.length) throw new Error("Failed to create all invitations");
    log("Invitations created successfully:", invitations, "info");


    // Emit socket events to invitees and host
    const payloadBase = {
      room
    };

    const hostName = await resolveHostName(hostUserId);

    // Notify each invitee in their personal room channel the inviteToken
    for (const invitation of invitations) {
      const { inviteeId, inviteToken } = invitation;
      const payload = {
        ...payloadBase,
        inviteToken,
        invitorId: hostUserId,
        inviteeId,
        message: `You have been invited to join the room ${roomId} by ${hostName}!`
      };
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
      await this._roomRepo.createRoomPlayer({
        roomId: room.id,
        userId: uid,
        status: "invited",
        invitedBy: hostUserId
      });
    }

    return { room, inviteeIds };
  };
}
