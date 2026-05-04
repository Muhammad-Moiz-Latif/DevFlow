import { publicApi } from "../../../lib/axios"
import type { DefaultResponse } from "../types"

interface VerifyEmailDataType {
    userId: string,
    otp: string
};

export const VerifyEmail = async (data: VerifyEmailDataType) => {
    const response = await publicApi.post<DefaultResponse>('/auth/verify-email', data);
    return response.data;
};