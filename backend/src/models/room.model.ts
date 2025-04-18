// models/room.model.ts
import { supabase } from "../database/db";
import { log } from "../lib/utils";

export interface Room {
  id: number;
  roomId: string;
  hostUserId: number;
  gameType: "sam" | "phom";
  maxPlayers: number;
  players: number[]; // user ID
  buyIn: number;
  valuePerPoint: number;
  createdAt: string;
  updatedAt: string;
}

export const mapRoomData = (data: any): Room => ({
  id: data.id,
  roomId: data.room_id,
  hostUserId: data.host_user_id,
  gameType: data.game_type,
  maxPlayers: data.max_players,
  players: data.players || [], // Map player_ids field and use an empty array as default
  buyIn: data.buy_in,
  valuePerPoint: data.valuePerPoint,
  createdAt: data.created_at,
  updatedAt: data.updated_at,
});

export interface RoomPlayer {
  roomId: number;
  userId: number;
}

export const mapRoomPlayerData = (data: any): RoomPlayer => ({
  roomId: data.room_id,
  userId: data.user_id,
});

// export interface GameLogEntry {
//   roomId: number;
//   playerId: number;
//   action: string;
//   timestamp: string;
// }


export const createRoom = async (room: {
  roomId: string;
  hostUserId: number;
  gameType: "sam" | "phom";
  maxPlayers: number;
  players: number[];
  buyIn: number;
  valuePerPoint: number;
}) => {

  const {data, error} = await supabase
    .from("rooms")
    .insert([
      {
        room_id: room.roomId,
        host_user_id: room.hostUserId,
        game_type: room.gameType,
        max_players: room.maxPlayers,
        players: room.players,
        buy_in: room.buyIn,
        value_per_point: room.valuePerPoint,
      }
    ])
    .select()
    .single();

  if (error || !data) {
    log("createRoom error:", error?.message, error?.details, "error");
    return null;
  }

  return mapRoomData(data);
};

export const createRoomPlayer = async (roomPlayer: RoomPlayer) => {
  const {data, error} = await supabase
    .from("room_players")
    .insert([
      {
        room_id: roomPlayer.roomId,
        user_id: roomPlayer.userId,
      }
    ])
    .select()

  if (error || !data) {
    log("createRoomPlayer error:", error?.message, error?.details, "error");
    return null;
  }

  return mapRoomPlayerData(data);
}

export const updateRoom = async (room: Room) => {
  const {data, error} = await supabase
    .from("rooms")
    .update({
      room_id: room.roomId,
      host_user_id: room.hostUserId,
      game_type: room.gameType,
      max_players: room.maxPlayers,
      players: room.players,
      buy_in: room.buyIn,
      value_per_point: room.valuePerPoint,
    })
    .eq("id", room.id)
    .select()
    .single();

  if (error || !data) {
    log("updateRoom error:", error?.message, error?.details, "error");
    return null;
  }

  return mapRoomData(data);
}

export const findRoomByRoomId = async (roomId: string): Promise<Room | null> => {
  const {data, error} = await supabase
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

export const getPlayersFromRoom = async (id: number): Promise<string[] | null> => {
  const {data, error} = await supabase
    .from("rooms")
    .select("players")
    .eq("id", id)
    .single();

  if (error) {
    log("Error finding room:", error, "error");
    return null;
  }

  log("getRoomPlayers:", data, "info");
  return data.players
}
