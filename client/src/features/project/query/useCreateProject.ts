import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createProject, type DataType } from "../api/create-project-api"
import { useAuthStore } from "../../../stores/auth-store";


export const useCreateProject = (workspaceId: string) => {
    const { user } = useAuthStore();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ data }: { data: DataType }) => createProject({ data }),
        onError: (err) => console.error(err),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['project', workspaceId, user?._id] })
        }
    })
}