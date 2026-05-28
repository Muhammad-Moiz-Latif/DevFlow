import { privateApi } from "../../../lib/axios"
import type { getWorkspaceMembersResponseType } from "../../types";

export const getWorkspaceMembers = async (workspaceId: string) => {
    const response = await privateApi.get<getWorkspaceMembersResponseType>(`/workspace/${workspaceId}/members`);
    return response.data;
}