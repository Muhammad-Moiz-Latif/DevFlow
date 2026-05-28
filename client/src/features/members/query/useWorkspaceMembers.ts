import { useQuery } from "@tanstack/react-query"
import { getWorkspaceMembers } from "../api/getWorkspaceMembers"

export const useWorkspaceMembers = (workspaceId: string) => {
    return useQuery({
        queryKey: ['workspace-members', workspaceId],
        queryFn: () => getWorkspaceMembers(workspaceId),
        staleTime: 4 * 60 * 1000
    });
};