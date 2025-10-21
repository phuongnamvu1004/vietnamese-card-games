import { CreateRoomPlayerRepoDTO, CreateRoomRepoDTO } from "../../dtos/room.dto";
import { Room, RoomPlayer } from "../../entities/room";

export interface IRoomRepository {
  createRoom(room: CreateRoomRepoDTO): Promise<Room | null>;

  createRoomPlayer(roomPlayer: CreateRoomPlayerRepoDTO): Promise<RoomPlayer | null>;

  updateRoom(room: Room): Promise<Room | null>;

  findRoomByRoomId(roomId: string): Promise<Room | null>;

  getRoomIdById(id: number): Promise<number | null>;

  getJoinedPlayersFromRoom(roomId: number): Promise<number[] | null>;

  updateRoomPlayerStatus(roomId: number, userId: number, status: "joined" | "left" | "kicked"): Promise<RoomPlayer | null>;

}