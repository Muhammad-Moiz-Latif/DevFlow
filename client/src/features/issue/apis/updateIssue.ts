import { privateApi } from "../../../lib/axios";
import type { DefaultResponse, MyIssueType } from "../../types";

interface updateIssueShape {
    workspaceId: string,
    projectId: string,
    issueData: Partial<MyIssueType>
};

export const updateIssue = async (data: updateIssueShape) => {
    const response = await privateApi.patch<DefaultResponse>(`/workspace/${data.workspaceId}/project/${data.projectId}/issue/${data.issueData.id}`, data.issueData);
    return response.data;
};