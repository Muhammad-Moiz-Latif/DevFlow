import { privateApi } from "../../../lib/axios"
import type { getAllProjectsInCurrentWorkspaceResponseType } from "../../types";

export const getAllProjectsInCurrentWorkspace = async (workspaceId: string) => {
    const response = await privateApi.get<getAllProjectsInCurrentWorkspaceResponseType>(`/workspace/${workspaceId}/project`);
    return response.data;
}