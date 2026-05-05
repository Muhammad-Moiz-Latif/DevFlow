import { useQuery } from "@tanstack/react-query"
import { AllIssues } from "../api/all-issues"

export const useMyIssues = (userId: string, workspaceId: string) => {
    return useQuery({
        queryKey: ['my-issues', userId, workspaceId],
        queryFn: () => AllIssues(workspaceId),
        enabled: !!userId && !!workspaceId
    });
};