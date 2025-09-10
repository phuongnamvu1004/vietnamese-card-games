export type CreateInvitationsRepoDTO = {
  invitorId: number; // user ID
  inviteeIds: number[]; // user ID
  roomId: number; // room ID
}

export type GetInvitationByIdRepoDTO = {
  invitorId: number;
  inviteeId: number;
  roomId: number;
}

export type UpdateInvitationStatusRepoDTO = {
  invitorId: number;
  inviteeId: number;
  roomId: number;
  status: "accepted" | "declined" | "canceled" | "expired";
}