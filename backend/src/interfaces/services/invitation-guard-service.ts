import { Invitation } from "../../entities/invitation";
import { AcceptInvitationInput, DeclineInvitationInput, CancelInvitationInput } from "./invitation-service";

export type GuardInput = AcceptInvitationInput | DeclineInvitationInput | CancelInvitationInput;

export interface IInvitationGuardService {
  verify(input: GuardInput): Promise<Invitation>; // throws on NOT_FOUND, INVALID_TOKEN, ALREADY_*, EXPIRED (after marking)
}