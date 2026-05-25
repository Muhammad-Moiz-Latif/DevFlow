import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateIssue } from "../apis/updateIssue";
import { useAuthStore } from "../../../stores/auth-store";
import type { MyIssueType } from "../../types";

export const useUpdateIssue = (workspaceId: string, projectId: string) => {
    const queryClient = useQueryClient();
    const { user } = useAuthStore();

    return useMutation({

        mutationFn: (data: Partial<MyIssueType>) => updateIssue({ workspaceId, projectId, issueData: data }),

        onMutate: async (data) => {
            console.log(data);
            // Step 1: Cancel any ongoing queries for this data
            await queryClient.cancelQueries({ queryKey: ['all-issues', user?._id, workspaceId, projectId] });
            // Step 2: Snapshot the old data
            const previousIteration = queryClient.getQueryData(['all-issues', user?._id, workspaceId, projectId]);
            // Step 3: Optimistically update the cache
            queryClient.setQueryData(['all-issues', user?._id, workspaceId, projectId], (oldData: { success: boolean, message: string, data: MyIssueType[] }) => {
                if (!oldData) return oldData;
                return {
                    ...oldData,
                    data: oldData.data.map((issue) => {
                        return issue.id === data.id ? { ...issue, ...data } : issue
                    })
                }
            });

            // Step 4: Return context for onError
            return { previousIteration };

        },

        onError: (_err, _vars, context) => {
            // Rollback using the backup
            if (context?.previousIteration) {
                queryClient.setQueryData(['all-issues', user?._id, workspaceId, projectId], context.previousIteration);
            }
        },

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['all-issues', user?._id, workspaceId, projectId] })
        }
    })
}