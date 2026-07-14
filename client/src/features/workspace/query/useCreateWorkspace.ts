import { useMutation } from "@tanstack/react-query"
import { createWorkspaceApi } from "../api/create-workspace-api"

export const useCreateWorkspace = () => {
    return useMutation({
        mutationFn: (workspaceName: string) => createWorkspaceApi(workspaceName),
    });
}