import { CreateInvitationsRepoDTO, GetInvitationByIdRepoDTO, UpdateInvitationStatusRepoDTO } from "../dtos/invitation.dto";
import { log } from "../lib/utils/logger";
import { mapInvitationData } from "../mappers/invitation.mapper";
import { SupabaseClient } from "@supabase/supabase-js";
import { IInvitationRepository } from "../interfaces/repositories/invitation-repository";
import { Invitation } from "../entities/invitation";

export class InvitationRepository implements IInvitationRepository {
  constructor(
    private readonly _db: SupabaseClient
  ) {}

  async createInvitations  (
    { invitorId, inviteeIds, roomId }: CreateInvitationsRepoDTO,
  ): Promise<Invitation[] | null>  {
    const invitationCreated = []
    for (const inviteeId of inviteeIds) {
      const { data, error } = await this._db
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
  };

  async getInvitationById ({ invitorId, inviteeId, roomId }: GetInvitationByIdRepoDTO): Promise<Invitation | null> {
    const { data, error } = await this._db
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
  };

  async updateInvitationStatus ({ invitorId, inviteeId, roomId, status }: UpdateInvitationStatusRepoDTO): Promise<Invitation | null> {
    const { data, error } = await this._db
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
  };
}

