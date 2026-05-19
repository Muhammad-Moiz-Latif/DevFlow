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
                element: <h1>My issues page</h1>
            },
            {
                path: "members",
                element: <h1>List all members page</h1>
            },
            {
                path: "notifications",
                element: <h1>This is the notifications page</h1>
            }
        ]
    },
    {
        path: "*",
        element: <h1>404 Page not found</h1>
    }
]);