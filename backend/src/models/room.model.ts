// models/room.model.ts
import { supabase } from "../database/db";

export interface Room {
  id: number;
  roomId: string;
  hostUserId: number;
  gameType: "sam" | "phom";
  maxPlayers: number;
  buyIn: number;
  valuePerPoint: number;
  createdAt: string;
  updatedAt: string;
}

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
  const { data, error } = await supabase
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

export const createRoom = async (room: Partial<Room>, players: number[], gameLog: GameLogEntry[]) => {
  const { data, error } = await supabase.from("rooms").insert([room]).select();

  if (error || !data || data.length === 0) {
    throw error;
  }

  const roomId = data[0].id;

  // Add players
  const playerInserts = players.map((userId) => ({ room_id: roomId, user_id: userId }));
  await supabase.from("room_players").insert(playerInserts);

  // Add game logs
  await supabase.from("game_logs").insert(
    gameLog.map((entry) => ({ ...entry, room_id: roomId }))
  );

  return data[0];
};
