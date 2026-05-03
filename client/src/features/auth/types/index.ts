type ApiResponse<T> = {
    success: boolean,
    message: string,
    data?: T,
    access_token?: string,
    defaultWorkspaceId?: {
        id : string,
        slug : string
    }
};


export type LoginResponse = ApiResponse<{
    _id: string,
    username: string,
    img: string,
    email: string,
    createdAt: string
}>;


export type SignUpResponse = ApiResponse<{
    userId: string
}>;

export type VerifyEmailResponse = ApiResponse<{}>;