import { privateApi } from "../../../lib/axios";
import type { getAllIssuesInCurrentProjectResponseType } from "../../types";

export const getAllIssuesInCurrentProject = async (workspaceId: string, projectId: string) => {
    const response = await privateApi.get<getAllIssuesInCurrentProjectResponseType>(`/workspace/${workspaceId}/project/${projectId}/all-issues`);
    return response.data;
};