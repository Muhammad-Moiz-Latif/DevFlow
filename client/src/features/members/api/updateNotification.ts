import { privateApi } from "../../../lib/axios"
import type { getMyNotificationsResponseType } from "../../types";

export const updateMyNotification = async (workspaceId: string, notificationId: string) => {
    const response = await privateApi.patch<getMyNotificationsResponseType>(`/workspace/${workspaceId}/notifications/${notificationId}/update`);
    return response.data;
}