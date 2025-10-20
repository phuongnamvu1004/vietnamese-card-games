import { Server } from "socket.io";

export type AcceptInvitationInput = {
  invitorId: number;
  inviteeId: number;
  roomId: number; // This is the "id" column in the "rooms" table, not the "roomId" column
}

export type DeclineInvitationInput = AcceptInvitationInput;
export type CancelInvitationInput = AcceptInvitationInput;

export interface IInvitationService {
  acceptInvitation(input: AcceptInvitationInput, io: Server): Promise<{message: string}>;
  declineInvitation(input: DeclineInvitationInput, io: Server): Promise<{message: string}>;
  cancelInvitation(input: CancelInvitationInput, io: Server): Promise<{message: string}>;
}