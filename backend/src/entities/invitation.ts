export interface Invitation {
  invitorId: number; // user ID
  inviteeId: number; // user ID
  roomId: number; // room ID
  status: "pending" | "accepted" | "declined" | "cancel" | "expired";
  createdAt: Date;
  expiredAt: Date;
  updatedAt: Date;
}