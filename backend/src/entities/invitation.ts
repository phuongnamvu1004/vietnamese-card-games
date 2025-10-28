export interface Invitation {
  invitorId: number; // user ID
  inviteeId: number; // user ID
  roomId: number; // room ID
  status: "pending" | "accepted" | "declined" | "cancel" | "expired";
  inviteToken: string;
  createdAt: Date;
  expiredAt: Date;
  updatedAt: Date;
}