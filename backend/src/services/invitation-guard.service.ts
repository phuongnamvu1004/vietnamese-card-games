import { IInvitationGuardService, GuardInput } from "../interfaces/services/invitation-guard-service";
import { IInvitationRepository } from "../interfaces/repositories/invitation-repository";

export class InvitationGuardService implements IInvitationGuardService {
  constructor(private readonly _invitationRepo: IInvitationRepository) {}

  async verify(input: GuardInput) {
    const { invitorId, inviteeId, roomId, inviteToken } = input;
    const invitation = await this._invitationRepo.getInvitationById({ invitorId, inviteeId, roomId });
    if (!invitation) throw new Error("NOT_FOUND");

    if (invitation.inviteToken !== inviteToken) throw new Error("INVALID_TOKEN");

    if (invitation.status !== "pending") {
      throw new Error("ALREADY_" + invitation.status.toUpperCase());
    }

    if (invitation.expiredAt < new Date()) {
      await this._invitationRepo.updateInvitationStatus({ invitorId, inviteeId, roomId, status: "expired" });
      throw new Error("EXPIRED");
    }

    return invitation;
  }
}