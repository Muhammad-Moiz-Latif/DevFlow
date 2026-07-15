import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createWorkspaceApi } from "../api/create-workspace-api"
import { useAuthStore } from "../../../stores/auth-store";

export const useCreateWorkspace = () => {
    const client = useQueryClient();
    const { user } = useAuthStore();
    return useMutation({
        mutationFn: (workspaceName: string) => createWorkspaceApi(workspaceName),
        onError: (err) => console.error(err),
        onSuccess: () => {
            client.invalidateQueries({ queryKey: ['all-workspaces', user?._id] });
        }
    });
};