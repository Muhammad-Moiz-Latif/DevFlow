import { privateApi } from "../../../lib/axios"

export const InviteMember = async ({ workspaceId, data }: { workspaceId: string, data: { email: string, role: 'ADMIN' | 'MEMBER' | 'VIEWER' } }) => {
    const response = await privateApi.post(`/workspace/${workspaceId}/invitations`, data);
    return response;
};