import { useMutation } from "@tanstack/react-query"
import { InviteMember } from "../api/InviteMemberApi"

export const useInviteMember = () => {
    return useMutation({
        mutationFn: ({ workspaceId, data }: { workspaceId: string, data: { email: string, role: 'ADMIN' | 'MEMBER' | 'VIEWER' } }) => InviteMember({ workspaceId, data }),
        onError: (error) => {
            console.error(error);
        }
    }) 
};