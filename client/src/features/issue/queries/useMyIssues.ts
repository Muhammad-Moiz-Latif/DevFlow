import { useQuery } from "@tanstack/react-query"
import { useAuthStore } from "../../../stores/auth-store"
import { MyIssueApi } from "../apis/myissue";

export const useMyIssues = (workspaceId: string, projectId: string) => {
    const { user } = useAuthStore();
    return useQuery({
        queryKey: ["my-issues", workspaceId, projectId, user?._id],
        queryFn: () => MyIssueApi(workspaceId, projectId),
        enabled: !!workspaceId
    });
};