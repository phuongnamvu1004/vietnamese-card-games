import { supabase } from "../databases/supabase";
import { log } from "../lib/utils/logger";
import { mapRoomData, mapRoomPlayerData } from "../mappers/room.mapper";
import { Room } from "../entities/room";
import { CreateRoomPlayerRepoDTO, CreateRoomRepoDTO } from "../dtos/room.dto";

export const createRoom = async (room: CreateRoomRepoDTO) => {
  const { data, error } = await supabase
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

export const createRoomPlayer = async (roomPlayer: CreateRoomPlayerRepoDTO) => {
  let joined_at: Date | null = null; // default for other players when create room
  // Only let joined_at be set if the player is the host,
  if (roomPlayer.status === "host") {
    joined_at = new Date();
  }

  const { data, error } = await supabase
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

export const getRoomIdById = async (
  id: number
): Promise<number | null> => {
  const { data, error } = await supabase
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

export const getJoinedPlayersFromRoom = async (
  roomId: number,
) => {
  const { data, error } = await supabase
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

export const updateRoomPlayerStatus = async (
  roomId: number,
  userId: number,
  status: "joined" | "left" | "kicked",
)=> {
  const { data, error } = await supabase
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