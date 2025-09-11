import { Room, RoomPlayer } from "../entities/room";

export const mapRoomData = (data: Record<string, unknown>): Room => ({
  id: Number(data.id),
  roomId: String(data.room_id),
  hostUserId: Number(data.host_user_id),
  gameType: data.game_type === "phom" ? "phom" : "sam", // validate enum
  maxPlayers: Number(data.max_players),
  players: Array.isArray(data.players) ? (data.players as number[]) : [],
  buyIn: Number(data.buy_in),
  betUnit: Number(data.bet_unit),
  isOnline: Boolean(data.is_online),
  createdAt: String(data.created_at),
  updatedAt: String(data.updated_at),
});

export const mapRoomPlayerData = (
  data: Record<string, unknown>,
): RoomPlayer => ({
  roomId: Number(data.room_id),
  userId: Number(data.user_id),
  status: data.status as RoomPlayer["status"],
  invitedBy: Number(data.invited_by),
  invitedAt: new Date(data.invited_at as string),
  joinedAt: data.joined_at ? new Date(data.joined_at as string) : null,
});