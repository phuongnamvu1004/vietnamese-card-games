import { supabase } from "../databases/supabase";
import { log } from "../lib/utils/logger";
import { mapRoomData, mapRoomPlayerData } from "../mappers/room.mapper";
import { Room, RoomPlayer } from "../entities/room";

export const createRoom = async (room: {
  roomId: string;
  hostUserId: number;
  gameType: "sam" | "phom";
  maxPlayers: number;
  players: number[];
  buyIn: number;
  betUnit: number;
}) => {
  const { data, error } = await supabase
    .from("rooms")
    .insert([
      {
        room_id: room.roomId,
        host_user_id: room.hostUserId,
        game_type: room.gameType,
        max_players: room.maxPlayers,
        players: room.players,
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

export const createRoomPlayer = async (roomPlayer: RoomPlayer) => {
  const { data, error } = await supabase
    .from("room_players")
    .insert([
      {
        room_id: roomPlayer.roomId,
        user_id: roomPlayer.userId,
        status: roomPlayer.status,
        invited_by: roomPlayer.invitedBy,
        invited_at: roomPlayer.invitedAt,
        joined_at: roomPlayer.joinedAt,
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

export const updateRoom = async (room: Room) => {
  const { data, error } = await supabase
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

export const findRoomByRoomId = async (
  roomId: string,
): Promise<Room | null> => {
  const { data, error } = await supabase
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

export const getPlayersFromRoom = async (
  id: number,
): Promise<number[] | null> => {
  const { data, error } = await supabase
    .from("rooms")
    .select("players")
    .eq("id", id)
    .single();

  if (error) {
    log("Error finding room:", error, "error");
    return null;
  }

  log("getRoomPlayers:", data, "info");
  return data.players;
};