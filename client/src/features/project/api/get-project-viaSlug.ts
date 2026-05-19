import { privateApi } from "../../../lib/axios"
import type { getProjectViaSlugResponseType } from "../../types";

export const getProjectViaSlug = async (projectSlug: string, workspaceId: string) => {
    const response = await privateApi.get<getProjectViaSlugResponseType>(`workspace/${workspaceId}/project/via-slug/${projectSlug}`);
    return response.data;
};