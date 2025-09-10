// import { Response } from "express";
import { Server } from "socket.io";
import { getInvitationById, updateInvitationStatus } from "../repositories/invitation.repository";
import { getRoomIdById } from "../repositories/room.repository";
import { log } from "../lib/utils/logger";

export type AcceptInvitationInput = {
  invitorId: number;
  inviteeId: number;
  roomId: number; // This is the "id" column in the "rooms" table, not the "roomId" column
}

export type DeclineInvitationInput = AcceptInvitationInput;
export type CancelInvitationInput = AcceptInvitationInput;

export const InvitationService = {
  async acceptInvitation(input: AcceptInvitationInput, io: Server) {
    const { invitorId, inviteeId, roomId } = input;
    const invitation = await getInvitationById({ invitorId, inviteeId, roomId });

    if (!invitation) throw new Error("NOT_FOUND");
    if (invitation.status !== "pending") throw new Error("ALREADY_" + invitation.status.toUpperCase());
    if (invitation.expiredAt < new Date()) {
      await updateInvitationStatus({ invitorId, inviteeId, roomId, status: "expired" });
      throw new Error("EXPIRED");
    }

    const updatedInvitation = await updateInvitationStatus({ invitorId, inviteeId, roomId, status: "accepted" });
    if (!updatedInvitation) throw new Error("UPDATE_FAILED");

    const userRoom = (userId: number) => `user:${userId}`;
    const roomIdCode = await getRoomIdById(roomId);
    if (!roomIdCode) throw new Error("ROOM_NOT_FOUND");

    // io.emit("joinRoom", { roomIdCode }); // TODO: SHOULD BE HANDLED BY CLIENT
    io.to(userRoom(inviteeId)).emit("invitation:accepted", { roomId: roomIdCode, invitorId, inviteeId });
    log(`User ${inviteeId} accepted invitation to room ${roomIdCode}`, "info");

    // return { message: "Invitation accepted", roomId: roomIdCode };
    return { message: "Invitation accepted" }; // roomIdCode is already broadcasted via socket to join room
  },

  async declineInvitation(input: DeclineInvitationInput, io: Server) {
    const { invitorId, inviteeId, roomId } = input;

    const invitation = await getInvitationById({ invitorId, inviteeId, roomId });

    if (!invitation) throw new Error("NOT_FOUND");
    if (invitation.status !== "pending") throw new Error("ALREADY_" + invitation.status.toUpperCase());
    if (invitation.expiredAt < new Date()) {
      await updateInvitationStatus({ invitorId, inviteeId, roomId, status: "expired" });
      throw new Error("EXPIRED");
    }

    const updatedInvitation = await updateInvitationStatus({ invitorId, inviteeId, roomId, status: "declined" });
    if (!updatedInvitation) throw new Error("UPDATE_FAILED");

    const userRoom = (userId: number) => `user:${userId}`;
    const roomIdCode = await getRoomIdById(roomId);
    if (!roomIdCode) throw new Error("ROOM_NOT_FOUND");

    io.emit("invitation:declined", { roomId: roomIdCode, invitorId, inviteeId });
    io.to(userRoom(inviteeId)).emit("invitation:declined", { roomId: roomIdCode, invitorId, inviteeId });

    return { message: "Invitation declined" };
  },

  async cancelInvitation(input: CancelInvitationInput, io: Server) {
    const { invitorId, inviteeId, roomId } = input;

    const invitation = await getInvitationById({ invitorId, inviteeId, roomId });

    if (!invitation) throw new Error("NOT_FOUND");
    if (invitation.status !== "pending") throw new Error("ALREADY_" + invitation.status.toUpperCase());

    const updatedInvitation = await updateInvitationStatus({ invitorId, inviteeId, roomId, status: "canceled" });
    if (!updatedInvitation) throw new Error("UPDATE_FAILED");

    const userRoom = (userId: number) => `user:${userId}`;
    const roomIdCode = await getRoomIdById(roomId);
    if (!roomIdCode) throw new Error("ROOM_NOT_FOUND");

    io.emit("invitation:canceled", { roomId: roomIdCode, invitorId, inviteeId });
    io.to(userRoom(inviteeId)).emit("invitation:canceled", { roomId: roomIdCode, invitorId, inviteeId });

    return { message: "Invitation canceled" };
  }
};