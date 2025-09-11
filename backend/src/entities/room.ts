export interface Room {
  id: number;
  roomId: string;
  hostUserId: number;
  gameType: "sam" | "phom";
  maxPlayers: number;
  players: number[]; // user ID
  buyIn: number;
  betUnit: number;
  isOnline: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RoomPlayer {
  roomId: number;
  userId: number;
  status: "host" | "invited" | "accepted" | "declined" | "left" | "kicked";
  invitedBy: number; // invitor user ID
  invitedAt: Date;
  joinedAt: Date | null;
}