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
            queryClient.cancelQueries({ queryKey: ['notifications', user?._id, workspaceId] });
            const previousIteration = queryClient.getQueryData(['notifications', user?._id, workspaceId]);
            queryClient.setQueryData(['notifications', user?._id, workspaceId], (oldData: {
                success: boolean,
                message: string,
                data: NotificationItem[],
            }) => {
                if (!oldData) return oldData;
                return {
                    ...oldData,
                    data: oldData.data.map((notification) => {
                        return notification.id === notificationId
                            ? { ...notification, isRead: true }
                            : notification
                    })
                }
            });

            return { previousIteration }
        },

        onError: (_err, _vars, context) => {
            // Rollback using the backup
            if (context?.previousIteration) {
                queryClient.setQueryData(['notifications', user?._id, workspaceId], context.previousIteration);
            }
        },

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications', user?._id, workspaceId] })
        }
    });
};