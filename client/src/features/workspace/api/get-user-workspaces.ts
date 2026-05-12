import { privateApi } from "../../../lib/axios"
import type { getUserWorkspacesResponseType } from "../../types";

export const getUserWorkspaces = async () => {
    const response = await privateApi.get<getUserWorkspacesResponseType>('/workspace/get-user-workspaces');
    return response.data;
}