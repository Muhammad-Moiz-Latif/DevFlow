import { privateApi } from "../../../lib/axios"
import type { getMyNotificationsResponseType } from "../../types";

export const InfiniteNotificationsApi = async (workspaceId: string, pageParam: string | undefined) => {
    const response = await privateApi.get<getMyNotificationsResponseType>(`/workspace/${workspaceId}/notifications`, {
        params: {
            cursor: pageParam
        }
    });
    return response.data;
};