import { supabase } from "../databases/supabase";
import { log } from "../lib/utils/logger";
import { mapRoomData, mapRoomPlayerData } from "../mappers/room.mapper";
import { Room, RoomPlayer } from "../entities/room";
import { CreateRoomPlayerRepoDTO, CreateRoomRepoDTO } from "../dtos/room.dto";
import { IRoomRepository } from "../interfaces/repositories/room-repository";
import { SupabaseClient } from "@supabase/supabase-js";

export class RoomRepository implements IRoomRepository {
  constructor(
    private readonly _db: SupabaseClient
  ) {}

  async createRoom(room: CreateRoomRepoDTO): Promise<Room | null> {
    const { data, error } = await this._db
      .from("rooms")
      .insert([
        {
          room_id: room.roomId,
          host_user_id: room.hostUserId,
          game_type: room.gameType,
          max_players: room.maxPlayers,
          buy_in: room.buyIn,
          bet_unit: room.betUnit,
        },
      ])
      .select()
      .single();

    if (error || !data) {
      log("createRoom error:", error?.message, error?.details, "error");
      return null;
    }

    return mapRoomData(data);
  };

  async createRoomPlayer(roomPlayer: CreateRoomPlayerRepoDTO): Promise<RoomPlayer | null> {
    let joined_at: Date | null = null; // default for other players when create room
    // Only let joined_at be set if the player is the host,
    if (roomPlayer.status === "host") {
      joined_at = new Date();
    }

    const { data, error } = await this._db
      .from("room_players")
      .insert([
        {
          room_id: roomPlayer.roomId,
          user_id: roomPlayer.userId,
          status: roomPlayer.status,
          invited_by: roomPlayer.invitedBy,
          invited_at: new Date(),
          joined_at
        },
      ])
      .select()
      .single();

    if (error || !data) {
      log("createRoomPlayer error:", error?.message, error?.details, "error");
      return null;
    }

    return mapRoomPlayerData(data);
  };

  async updateRoom(room: Room): Promise<Room | null> {
    const { data, error } = await this._db
      .from("rooms")
      .update({
        room_id: room.roomId,
        host_user_id: room.hostUserId,
        game_type: room.gameType,
        max_players: room.maxPlayers,
        players: room.players,
        buy_in: room.buyIn,
        bet_unit: room.betUnit,
        is_online: room.isOnline,
      })
      .eq("id", room.id)
      .select()
      .single();

    if (error || !data) {
      log("updateRoom error:", error?.message, error?.details, "error");
      return null;
    }

    return mapRoomData(data);
  };

  async findRoomByRoomId(
    roomId: string,
  ): Promise<Room | null> {
    const { data, error } = await this._db
      .from("rooms")
      .select("*")
      .eq("room_id", roomId)
      .single();

    if (error) {
      log("Error finding room:", error, "error");
      return null;
    }

    log("findRoomByRoomId:", data, "info");

    return mapRoomData(data);
  };

  async getRoomIdById(
    id: number
  ): Promise<number | null> {
    const { data, error } = await this._db
      .from("rooms")
      .select("room_id")
      .eq("id", id)
      .single();

    if (error) {
      log("Error finding room by id:", error, "error");
      return null;
    }

    return data.room_id
  }

  async getJoinedPlayersFromRoom(
    roomId: number,
  ): Promise<number[] | null> {
    const { data, error } = await this._db
      .from("room_players")
      .select("user_id")
      .eq("room_id", roomId)
      .in("status", ["joined"]);

    if (error) {
      log("Error finding room:", error, "error");
      return null;
    }

    log("getRoomPlayers:", data, "info");
    return data?.map((player) => player.user_id) || [];
  };

  async updateRoomPlayerStatus(
    roomId: number,
    userId: number,
    status: "joined" | "left" | "kicked",
  ): Promise<RoomPlayer | null> {
    const { data, error } = await this._db
      .from("room_players")
      .update({
        status: status,
        joined_at: new Date()
      })
      .eq("room_id", roomId)
      .eq("user_id", userId)
      .select("*")
      .single();

    if (error) {
      log("Error updating room player status:", error, "error");
      return null;
    }

    log("updateRoomPlayerStatus:", data, "info");
    return mapRoomPlayerData(data);
  }
}

export const roomRepository = new RoomRepository(supabase);

// findRoomByRoomId, getJoinedPlayersFromRoom, updateRoomPlayerStatus for join-room.handler
export const findRoomByRoomId = (...args: Parameters<RoomRepository["findRoomByRoomId"]>) =>
  roomRepository.findRoomByRoomId(...args);

export const getJoinedPlayersFromRoom = (...args: Parameters<RoomRepository["getJoinedPlayersFromRoom"]>) =>
  roomRepository.getJoinedPlayersFromRoom(...args);

export const updateRoomPlayerStatus = (...args: Parameters<RoomRepository["updateRoomPlayerStatus"]>) =>
  roomRepository.updateRoomPlayerStatus(...args);