import { useQuery } from "@tanstack/react-query"
import { useAuthStore } from "../../../stores/auth-store"
import { getAllIssuesInCurrentProject } from "../api/get-all-issues";

export const useIssuesInCurrentProject = (workspaceId: string, projectId: string) => {
    const { user } = useAuthStore();
    return useQuery({
        queryKey: ['all-issues', user?._id, workspaceId, projectId],
        queryFn: () => getAllIssuesInCurrentProject(workspaceId, projectId),
        enabled: !!workspaceId && !!projectId,
    });
};