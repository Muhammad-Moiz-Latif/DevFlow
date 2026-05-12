import { privateApi } from "../../../lib/axios";
import type { getAllActivityLogsOfWorkspaceType } from "../../types";

export const getAllActivityLogsOfWorkspace = async (workspaceId: string) => {
    const response = await privateApi.get<getAllActivityLogsOfWorkspaceType>(`/workspace/${workspaceId}/activity-logs`);
    return response.data;
};