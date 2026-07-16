import { privateApi } from "../../../lib/axios"
import type { getMyIssuesResponseType } from "../../types";

export const MyIssueApi = async (workspaceId: string, projectId: string) => {
    const response = await privateApi.get<getMyIssuesResponseType>(`/workspace/${workspaceId}/project/${projectId}/my-issues`);
    return response.data;
};