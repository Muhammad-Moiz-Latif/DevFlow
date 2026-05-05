import { string } from "zod";

type ApiResponse<T> = {
    success: boolean,
    message: string,
    data?: T,
    access_token?: string,
    defaultWorkspaceId?: {
        id: string,
        slug: string
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

export type DefaultResponse = ApiResponse<{}>;

type IssueType = {
    id: string,
    project_id: string,
    workspace_id: string,
    title: string,
    description: string,
    status: 'TODO' | 'IN_PROGRESS' | "IN_REVIEW" | "DONE",
    priority: "URGENT" | "HIGH" | "MEDIUM" | "LOW",
    assignee_id: string,
    createdBy: string,
    order: number,
    dueDate: Date,
    createdAt: Date,
    updatedAt: Date
};

export type MyIssuesResponseType = ApiResponse<[IssueType]>;

export type GetWorkspaceResponseType = ApiResponse<{
    id: string,
    name: string,
    img: string,
    owner_id: string,
    createdAt: Date
}>;