import { Server } from "socket.io";
import { log } from "../lib/utils/logger";
import { IRoomRepository } from "../interfaces/repositories/room-repository";
import { IInvitationRepository } from "../interfaces/repositories/invitation-repository";
import {
  AcceptInvitationInput, CancelInvitationInput,
  DeclineInvitationInput,
  IInvitationService
} from "../interfaces/services/invitation-service";

// services/invitation.service.ts (excerpt)
import { IInvitationGuardService } from "../interfaces/services/invitation-guard-service";

export class InvitationService implements IInvitationService {
  constructor(
    private readonly _roomRepo: IRoomRepository,
    private readonly _invitationRepo: IInvitationRepository,
    private readonly _guard: IInvitationGuardService,
  ) {}

  private userRoom = (userId: number) => `user:${userId}`;

  private async getRoomCodeOrThrow(roomId: number) {
    const code = await this._roomRepo.getRoomIdById(roomId);
    if (!code) throw new Error("ROOM_NOT_FOUND");
    return code;
  }

  async acceptInvitation(input: AcceptInvitationInput, io: Server) {
    await this._guard.verify(input);

    const { invitorId, inviteeId, roomId } = input;
    const updated = await this._invitationRepo.updateInvitationStatus({ invitorId, inviteeId, roomId, status: "accepted" });
    if (!updated) throw new Error("UPDATE_FAILED");

    // Update RoomPlayer status to 'accepted'
    const updatedRoomPlayer = await this._roomRepo.updateRoomPlayerStatus(roomId, inviteeId, "accepted");
    if (!updatedRoomPlayer) throw new Error("UPDATE_FAILED");

    const roomIdCode = await this.getRoomCodeOrThrow(roomId);
    io.to(this.userRoom(inviteeId)).emit("invitation:accepted", { roomId: roomIdCode, invitorId, inviteeId });
    log(`User ${inviteeId} accepted invitation to room ${roomIdCode}`, "info");
    return { message: "Invitation accepted" };
  }

  async declineInvitation(input: DeclineInvitationInput, io: Server) {
    await this._guard.verify(input);
    const { invitorId, inviteeId, roomId } = input;

    const updated = await this._invitationRepo.updateInvitationStatus({ invitorId, inviteeId, roomId, status: "declined" });
    if (!updated) throw new Error("UPDATE_FAILED");

    const updatedRoomPlayer = await this._roomRepo.updateRoomPlayerStatus(roomId, inviteeId, "declined");
    if (!updatedRoomPlayer) throw new Error("UPDATE_FAILED");

    const roomIdCode = await this.getRoomCodeOrThrow(roomId);
    io.emit("invitation:declined", { roomId: roomIdCode, invitorId, inviteeId });
    io.to(this.userRoom(inviteeId)).emit("invitation:declined", { roomId: roomIdCode, invitorId, inviteeId });
    return { message: "Invitation declined" };
  }

  async cancelInvitation(input: CancelInvitationInput, io: Server) {
    await this._guard.verify(input);
    const { invitorId, inviteeId, roomId } = input;

    const updated = await this._invitationRepo.updateInvitationStatus({ invitorId, inviteeId, roomId, status: "canceled" });
    if (!updated) throw new Error("UPDATE_FAILED");

    const updatedRoomPlayer = await this._roomRepo.updateRoomPlayerStatus(roomId, inviteeId, "canceled");
    if (!updatedRoomPlayer) throw new Error("UPDATE_FAILED");

    const roomIdCode = await this.getRoomCodeOrThrow(roomId);
    io.emit("invitation:canceled", { roomId: roomIdCode, invitorId, inviteeId });
    io.to(this.userRoom(inviteeId)).emit("invitation:canceled", { roomId: roomIdCode, invitorId, inviteeId });
    return { message: "Invitation canceled" };
  }
}