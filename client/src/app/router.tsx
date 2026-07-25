import { createBrowserRouter } from "react-router";
import { LandingPage } from "./routes/landing-page";
import { SignupPage } from "./routes/signup";
import { LoginPage } from "./routes/login";
import { DashboardLayout } from "../components/layout/dashboard-layout";
import { Dashboard } from "./routes/workspace/workspaceSlug/index";
import { CreateWorkspacePage } from "../app/routes/create-workspace-page";
import { VerifyEmailPage } from "./routes/verify-email";
import { AllProjects } from "./routes/workspace/workspaceSlug/projects";
import { KanbanBoard } from "./routes/workspace/workspaceSlug/projects/KanbanBoard";
import { MyIssuesPage } from "./routes/workspace/workspaceSlug/myIssues";
import { MembersPage } from "./routes/workspace/workspaceSlug/members";
import { NotificationsPage } from "./routes/workspace/workspaceSlug/notifications";
import { AcceptMemberInvitationModal } from "../features/auth/components/accept-workspace-invitation-modal";


export const router = createBrowserRouter([
    {
        path: '/',
        element: <LandingPage />
    },
    {
        path: '/login',
        element: <LoginPage />
    },
    {
        path: '/signup',
        element: <SignupPage />
    },
    {
        path: '/verify-email',
        element: <VerifyEmailPage />
    },
    {
        path: '/create-workspace',
        element: <CreateWorkspacePage />
    },
    {
        path: '/accept-invitation',
        element: <AcceptMemberInvitationModal />
    },
    {
        path: '/w/:workspaceSlug',
        element: <DashboardLayout />,
        children: [
            {
                index: true,
                element: <Dashboard />
            },
            {
                path: 'projects',
                children: [
                    {
                        index: true,
                        element: <AllProjects />

                    },
                    {
                        path: ":projectSlug",
                        element: <KanbanBoard />
                    }
                ]

            },
            {
                path: "my-issues",
                element: <MyIssuesPage />
            },
            {
                path: "members",
                element: <MembersPage />
            },
            {
                path: "notifications",
                element: <NotificationsPage />
            }
        ]
    },
    {
        path: "*",
        element: <h1>404 Page not found</h1>
    }
]);