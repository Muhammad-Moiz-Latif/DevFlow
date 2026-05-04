import { publicApi } from "../../../lib/axios"
import type { LoginSchemaType } from "../components/login-form";
import type { LoginResponse } from "../types";

export const Login = async (data: LoginSchemaType) => {
    const response = await publicApi.post<LoginResponse>('/auth/login', data, {
        withCredentials: true
    });
    return response.data;
};