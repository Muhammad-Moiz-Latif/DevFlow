import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useAuthStore } from "../../../stores/auth-store"
import { createIssue, type createIssueType } from "../apis/createissue";

export const useCreateIssue = (workspaceId: string, projectId: string) => {
    const { user } = useAuthStore();
    const client = useQueryClient();
    return useMutation({
        mutationKey: ['create-issue', workspaceId, projectId, user?._id],
        mutationFn: (data: createIssueType) => createIssue(data),
        onSettled: () => {
            client.invalidateQueries({ queryKey: ['all-issues', user?._id, workspaceId, projectId] });
            client.invalidateQueries({ queryKey: ['notifications', user?._id, workspaceId] })
        }
    });
};