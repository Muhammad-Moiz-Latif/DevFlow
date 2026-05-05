import { privateApi } from "../../../lib/axios"
import type { GetWorkspaceResponseType } from "../../types";

export const getWorkspaceDataViaSlug = async (slug: string) => {
    const response = await privateApi.get<GetWorkspaceResponseType>(`/workspace/${slug}/bySlug`);
    return response.data
}