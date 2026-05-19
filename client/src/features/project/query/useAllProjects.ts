import { useQuery } from "@tanstack/react-query"
import { useAuthStore } from "../../../stores/auth-store"
import { getAllProjectsInCurrentWorkspace } from "../api/get-all-projects";

export const useAllProjects = (workspaceId: string) => {
    const { user } = useAuthStore();
    return useQuery({
        queryKey: ['project', workspaceId, user?._id],
        queryFn: () => getAllProjectsInCurrentWorkspace(workspaceId)
    });
};