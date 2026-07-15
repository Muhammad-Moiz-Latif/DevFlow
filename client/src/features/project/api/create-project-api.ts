import { privateApi } from "../../../lib/axios"
import type { getCreateProjectResponseType } from "../../types";

export interface DataType {
    name: string,
    description: string,
    workspaceId: string
};

export const createProject = async ({ data }: { data: DataType }) => {
    const response = await privateApi.post<getCreateProjectResponseType>(`/workspace/${data.workspaceId}/project/create-project`, { name: data.name, description: data.description });
    return response.data;
};