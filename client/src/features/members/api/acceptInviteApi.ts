import { privateApi } from "../../../lib/axios"
import type { AcceptInvitationTypeResponse } from "../../types";

export const AcceptInviteApi = async (token: string | null) => {
    const response = await privateApi.post<AcceptInvitationTypeResponse>('/invitations/accept', {token});
    return response.data;
};