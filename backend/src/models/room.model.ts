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

export interface GameLogEntry {
  roomId: number;
  playerId: number;
  action: string;
  timestamp: string;
}

export const findRoomByRoomId = async (roomId: string): Promise<Room | null> => {
  const {data, error} = await supabase
    .from("rooms")
    .select("*")
    .eq("room_id", roomId)
    .single();

  if (error) {
    console.error("Error finding room:", error);
    return null;
  }

  return data;
};

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
