export interface Room {
  id: number;
  roomId: string;
  hostUserId: number;
  gameType: "sam" | "phom";
  maxPlayers: number;
  buyIn: number;
  betUnit: number;
  createdAt: string;
  updatedAt: string;
}

export interface RoomPlayer {
  roomId: number;
  userId: number;
  status: "host" | "invited" | "accepted" | "declined" | "canceled" | "joined" | "left" | "kicked";
  invitedBy: number; // invitor user ID
  invitedAt: Date | null;
  joinedAt: Date | null;
}