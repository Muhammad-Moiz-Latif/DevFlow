import { privateApi } from "../../../lib/axios"
import type { MyIssuesResponseType } from "../../types";

export const AllIssues = async (workspaceId: string) => {
    const response = await privateApi.get<MyIssuesResponseType>(`/workspace/${workspaceId}/my-issues`);
    return response.data;
};