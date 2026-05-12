import { useQuery } from "@tanstack/react-query"
import { useAuthStore } from "../../../stores/auth-store"
import { getAllActivityLogsOfWorkspace } from "../api/get-activity-logs";

export const useAllActivityLogs = (workspaceId: string) => {
    const { user } = useAuthStore();
    return useQuery({
        queryKey: ['activity-logs', workspaceId, user?._id],
        queryFn: () => getAllActivityLogsOfWorkspace(workspaceId)
    });
};