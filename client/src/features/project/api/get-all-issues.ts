import { privateApi } from "../../../lib/axios";
import type { getAllIssuesInCurrentProjectResponseType } from "../../types";

export const getAllIssuesInCurrentProject = async (workspaceId: string, projectId: string) => {
    console.log('yoo?');
    const response = await privateApi.get<getAllIssuesInCurrentProjectResponseType>(`/workspace/${workspaceId}/project/${projectId}/all-issues`);
    return response.data;
};