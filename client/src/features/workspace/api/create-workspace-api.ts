import { privateApi } from "../../../lib/axios"
import type { DefaultResponse } from "../../types";

export const createWorkspaceApi = async (workspaceName: string) => {
    const response = await privateApi.post<DefaultResponse>('/workspace/create-workspace', { name: workspaceName });
    return response.data;
};