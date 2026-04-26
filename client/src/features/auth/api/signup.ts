import { publicApi } from "../../../lib/axios";
import type { SignUpSchemaType } from "../components/signup-form";
import type { SignUpResponse } from "../types";

export const SignUp = async (data: SignUpSchemaType) => {
    const formdata = new FormData();
    if (data.email) formdata.append("email", data.email)
    if (data.username) formdata.append("name", data.username)
    if (data.password) formdata.append("password", data.password)
    if (data.image && data.image.length > 0) formdata.append("image", data.image[0])

    const response = await publicApi.post<SignUpResponse>('/auth/register', formdata, {
        headers: {
            'Content-Type': "multipart/formdata"
        }
    });

    return response.data;
};