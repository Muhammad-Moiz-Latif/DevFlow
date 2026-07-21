import { useQuery } from "@tanstack/react-query"
import { useAuthStore } from "../../../stores/auth-store"
import { NotificationsApi } from "../api/NotificationsApi";

export const useMyNotifications = (workspaceId: string) => {
    const { user } = useAuthStore();
    return useQuery({
        queryKey: ['notifications', user?._id, workspaceId],
        queryFn: () => NotificationsApi(workspaceId),
        enabled: !!workspaceId
    });
};