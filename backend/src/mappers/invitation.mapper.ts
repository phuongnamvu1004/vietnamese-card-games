import { Invitation } from "../entities/invitation";

export const mapInvitationData = (data: Record<string, unknown>): Invitation => ({
  inviteeId: Number(data.invitee_id),
  invitorId: Number(data.invitor_id),
  roomId: Number(data.room_id),
  status: data.status as Invitation["status"],
  inviteToken: String(data.invite_token),
  createdAt: new Date(data.created_at as string),
  expiredAt: new Date(data.expired_at as string),
  updatedAt: new Date(data.updated_at as string),
});