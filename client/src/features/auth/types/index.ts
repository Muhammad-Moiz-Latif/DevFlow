type ApiResponse<T> = {
    success: boolean,
    message: string,
    data?: T,
    access_token?: string
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