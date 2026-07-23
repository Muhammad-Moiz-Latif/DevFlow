import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateMyNotification } from "../api/updateNotification"
import { useAuthStore } from "../../../stores/auth-store";
import type { NotificationItem } from "../../types";

export const useUpdateNotification = (workspaceId: string, notificationId: string) => {
    const { user } = useAuthStore();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => updateMyNotification(workspaceId, notificationId),

        onMutate: async () => {
            // queryClient.cancelQueries({ queryKey: ['notifications', user?._id, workspaceId] });
            queryClient.cancelQueries({ queryKey: ['infinitenotifications', user?._id, workspaceId] });
            // const previousBellIteration = queryClient.getQueryData(['notifications', user?._id, workspaceId]);
            const previousInfiniteIteration = queryClient.getQueryData(['infinitenotifications', user?._id, workspaceId]);

            // queryClient.setQueryData(['notifications', user?._id, workspaceId], (oldData: {
            //     success: boolean,
            //     message: string,
            //     data: {
            //         notifications: NotificationItem[],
            //         nextCursor: string | undefined
            //     },
            // }) => {
            //     if (!oldData) return oldData;
            //     return {
            //         ...oldData,
            //         data: oldData.data.notifications.filter((notification) => notification.id != notificationId)
            //     }
            // });

            queryClient.setQueryData(['infinitenotifications', user?._id, workspaceId], (old: {
                pageParams: string[],
                pages: {
                    success: boolean,
                    message: string,
                    data: {
                        notifications: NotificationItem[],
                        nextCursor: string | undefined
                    }
                }[]
            }) => {
                if (!old) return old;
                return {
                    ...old,
                    pages: old.pages.map((page: {
                        success: boolean,
                        message: string,
                        data: {
                            notifications: NotificationItem[],
                            nextCursor: string | undefined
                        }
                    }) => {
                        return {
                            ...page,
                            data: {
                                ...page.data, notifications: page.data.notifications.map((notification: NotificationItem) =>
                                    notification.id === notificationId ? { ...notification, isRead: true } : notification
                                )
                            }
                        }
                    })
                };
            });

            return { previousInfiniteIteration }
        },

        onError: (_err, _vars, context) => {
            // Rollback using the backup
            // if (context?.previousBellIteration) {
            //     queryClient.setQueryData(['notifications', user?._id, workspaceId], context.previousBellIteration);
            // };
            if (context?.previousInfiniteIteration) {
                queryClient.setQueryData(['infinitenotifications', user?._id, workspaceId], context.previousInfiniteIteration);
            };

        },

        onSettled: () => {
            // queryClient.invalidateQueries({ queryKey: ['notifications', user?._id, workspaceId] });
            queryClient.invalidateQueries({
                queryKey: ['infinitenotifications', user?._id, workspaceId]
            })
        }
    });
};