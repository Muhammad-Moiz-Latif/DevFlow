import { privateApi } from "../../../lib/axios"
import type { DefaultResponse } from "../../types";

export const InviteMember = async ({ workspaceId, data }: { workspaceId: string, data: { email: string, role: 'ADMIN' | 'MEMBER' | 'VIEWER' } }) => {
    const response = await privateApi.post(`/workspace/${workspaceId}/invitations`, data);
    return response;
};