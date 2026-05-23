
type ApiResponse<T> = {
    success: boolean,
    message: string,
    data?: T,
    access_token?: string,
    defaultWorkspaceSlug?: string
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

export type MyIssueType = {
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

export type IssueType = {
    id: string,
    title: string,
    description: string,
    status: 'TODO' | 'IN_PROGRESS' | "IN_REVIEW" | "DONE",
    priority: "URGENT" | "HIGH" | "MEDIUM" | "LOW",
    order: number,
    dueDate: Date,
    createdAt: Date,
    updatedAt: Date,
    assignee: {
        id: string,
        name: string,
        email: string,
        img: string
    },
    creator: {
        id: string,
        name: string,
        email: string,
        img: string
    }
}

type AllWorkspaceType = {
    role: string,
    workspace: {
        name: string,
        slug: string
    }
};

type ActivityLogType = {
    id: string,
    issueId: string,
    workspaceId: string,
    logType: 'STATUS_CHANGED' | 'PRIORITY_CHANGED' | 'ASSIGNEE_CHANGED' | 'COMMENT_ADDED' | 'COMMENT_DELETED' | 'ISSUE_CREATED',
    oldValue: string,
    newValue: string,
    createdAt: Date,
    actor: {
        id: string,
        username: string,
        email: string,
        img: string
    }
};

type ProjectType = {
    id: string,
    workspace_id: string,
    name: string,
    description: string,
    slug: string,
    status: 'Active' | 'Archived',
    created_by: string,
    created_at: Date,
    updated_at: Date
};

export type KanbanColumnType = {
    id: string,
    title: string
};

export type MyIssuesResponseType = ApiResponse<[MyIssueType]>;

export type GetWorkspaceResponseType = ApiResponse<{
    id: string,
    name: string,
    img: string,
    owner_id: string,
    createdAt: Date
}>;

export type getAllActivityLogsOfWorkspaceType = ApiResponse<[ActivityLogType]>;

export type getUserWorkspacesResponseType = ApiResponse<[AllWorkspaceType]>;

export type getAllProjectsInCurrentWorkspaceResponseType = ApiResponse<[ProjectType]>;

export type getAllIssuesInCurrentProjectResponseType = ApiResponse<[IssueType]>;

export type getProjectViaSlugResponseType = ApiResponse<ProjectType>;