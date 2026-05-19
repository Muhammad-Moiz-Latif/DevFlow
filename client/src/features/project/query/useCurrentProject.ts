import { useQuery } from "@tanstack/react-query"
import { useAuthStore } from "../../../stores/auth-store"
import { getProjectViaSlug } from "../api/get-project-viaSlug";

export const useCurrentProject = (projectSlug: string, workspaceId: string) => {
    const { user } = useAuthStore();
    return useQuery({
        queryKey: ['currentProject', user?._id, projectSlug, workspaceId],
        queryFn: () => getProjectViaSlug(projectSlug, workspaceId),
        enabled: !!projectSlug && !!workspaceId,
    });
};