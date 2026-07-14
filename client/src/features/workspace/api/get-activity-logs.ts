import { privateApi } from "../../../lib/axios";
import type { getAllActivityLogsOfWorkspaceType } from "../../types";

export const getAllActivityLogsOfWorkspace = async (workspaceId: string) => {
    console.log('activity tests');
    const response = await privateApi.get<getAllActivityLogsOfWorkspaceType>(`/workspace/${workspaceId}/activity-logs`);
    return response.data;
};