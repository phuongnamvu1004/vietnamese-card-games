export type CreateRoomRequestDTO = {
  gameType: "sam" | "phom";
  maxPlayers: number;
  buyIn: number;
  betUnit: number;
  players: string[]; // player emails to send invitations to
}

export type CreateRoomRepoDTO = {
  roomId: string;
  hostUserId: number;
  gameType: "sam" | "phom";
  maxPlayers: number;
  buyIn: number;
  betUnit: number;
}

export type CreateRoomPlayerRepoDTO = {
  roomId: number;
  userId: number;
  status: "host" | "invited" | "accepted" | "declined" | "left" | "kicked";
  invitedBy: number; // invitor user ID
}