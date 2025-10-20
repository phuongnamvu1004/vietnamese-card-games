import { Server } from "socket.io";
import { Room } from "../../entities/room";

export type CreateRoomServiceInput = {
  roomId: string;
  hostUserId: number;
  gameType: "sam" | "phom";
  maxPlayers: number;
  buyIn: number;
  betUnit: number;
  inviteeEmails: string[]; // controller passes emails; service resolves to ids
};

export type CreateRoomServiceOutput = {
  room: Room;
  inviteeIds: number[];
};
export interface IRoomService {
  createRoomWithInvitations(input: CreateRoomServiceInput, io: Server): Promise<CreateRoomServiceOutput>;
}