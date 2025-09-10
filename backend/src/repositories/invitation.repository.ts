import { CreateInvitationsRepoDTO, GetInvitationByIdRepoDTO, UpdateInvitationStatusRepoDTO } from "../dtos/invitation.dto";
import { supabase } from "../databases/supabase";
import { log } from "../lib/utils/logger";
import { mapInvitationData } from "../mappers/invitation.mapper";

export const createInvitations = async (
  { invitorId, inviteeIds, roomId }: CreateInvitationsRepoDTO,
) => {
  const invitationCreated = []
  for (const inviteeId of inviteeIds) {
    const { data, error } = await supabase
      .from("invitations")
      .insert([
        {
          invitor_id: invitorId,
          invitee_id: inviteeId,
          room_id: roomId,
          status: "pending",
          created_at: new Date(),
          expired_at: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes from now
          updated_at: new Date(),
        },
      ])
      .select()
      .single();

    if (error || !data) {
      log("createInvitation error:", error?.message, error?.details, "error");
      return null;
    }
    invitationCreated.push(mapInvitationData(data));
  }

  return invitationCreated;
}

export const getInvitationById = async ({ invitorId, inviteeId, roomId }: GetInvitationByIdRepoDTO) => {
  const { data, error } = await supabase
    .from("invitations")
    .select("*")
    .eq("invitor_id", invitorId)
    .eq("invitee_id", inviteeId)
    .eq("room_id", roomId)
    .single();

  if (error || !data) {
    log("getInvitationById error:", error?.message, error?.details, "error");
    return null;
  }
  return mapInvitationData(data);
}

export const updateInvitationStatus = async ({ invitorId, inviteeId, roomId, status }: UpdateInvitationStatusRepoDTO) => {
  const { data, error } = await supabase
    .from("invitations")
    .update({ status, updated_at: new Date() })
    .eq("invitor_id", invitorId)
    .eq("invitee_id", inviteeId)
    .eq("room_id", roomId)
    .select()
    .single();

  if (error || !data) {
    log("updateInvitationStatus error:", error?.message, error?.details, "error");
    return null;
  }
  return mapInvitationData(data);
}