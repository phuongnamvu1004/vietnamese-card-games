import {
  CreateInvitationsRepoDTO,
  GetInvitationByIdRepoDTO,
  UpdateInvitationStatusRepoDTO
} from "../../dtos/invitation.dto";
import { Invitation } from "../../entities/invitation";

export interface IInvitationRepository {
  createInvitations({ invitorId, inviteeIds, roomId }: CreateInvitationsRepoDTO): Promise<Invitation[] | null>;

  getInvitationById({ invitorId, inviteeId, roomId }: GetInvitationByIdRepoDTO): Promise<Invitation | null>;

  updateInvitationStatus({ invitorId, inviteeId, roomId, status }: UpdateInvitationStatusRepoDTO): Promise<Invitation | null>;
}
