import { useInfiniteQuery } from "@tanstack/react-query"
import { useAuthStore } from "../../../stores/auth-store"
import { InfiniteNotificationsApi } from "../api/InfiniteNotificationApi";
import type { getMyNotificationsResponseType } from "../../types";

export const useMyInfiniteNotifications = (workspaceId: string) => {
    const { user } = useAuthStore();
    return useInfiniteQuery({
        queryKey: ['infinitenotifications', user?._id, workspaceId],
        queryFn: ({ pageParam }) => InfiniteNotificationsApi(workspaceId, pageParam),
        enabled: !!workspaceId,
        initialPageParam: undefined,
        getNextPageParam: (lastPage: getMyNotificationsResponseType) => {
            return lastPage.data?.nextCursor ?? undefined
        }
    });
};
