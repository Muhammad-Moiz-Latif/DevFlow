import { privateApi } from "../../../lib/axios";
import type { DefaultResponse } from "../../types";

export type createIssueType = {
    workspaceId: string,
    projectId: string,
    issue: Partial<{
        title: string,
        description: string,
        status: 'TODO' | 'IN_PROGRESS' | "IN_REVIEW" | "DONE",
        priority: "URGENT" | "HIGH" | "MEDIUM" | "LOW",
        assignee_id: string,
        due_date: Date
    }>
};

export const createIssue = async (data: createIssueType) => {
    const response = await privateApi.post<DefaultResponse>(`/workspace/${data.workspaceId}/project/${data.projectId}/create-issue`, data.issue);
    return response.data
};