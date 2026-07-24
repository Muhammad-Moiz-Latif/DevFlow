import { useQuery } from "@tanstack/react-query"
import { getWorkspaceDataViaSlug } from "../api/get-workspace-data"

export const useCurrentWorkspace = (slug: string) => {
    return useQuery({
        queryKey: ['current-workspace', slug],
        queryFn: () => getWorkspaceDataViaSlug(slug),
        enabled: !!slug,
        staleTime: 5 * 60 * 1000, // 5 minutes — don't refetch on every remount
    });
};