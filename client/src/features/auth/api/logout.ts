import { privateApi } from "../../../lib/axios"
import type { DefaultResponse } from "../types";

export const Logout = async () => {
    const response = await privateApi.get<DefaultResponse>('/auth/logout');
    return response.data;
};