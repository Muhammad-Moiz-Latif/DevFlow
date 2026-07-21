import { privateApi } from "../../../lib/axios"
import type { getMyNotificationsResponseType } from "../../types";

export const NotificationsApi = async (workspaceId: string) => {
    const response = await privateApi.get<getMyNotificationsResponseType>(`/workspace/${workspaceId}/notifications`);
    return response.data;
};