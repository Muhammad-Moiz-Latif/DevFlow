import { createBrowserRouter } from "react-router";
import { LandingPage } from "./routes/landing-page";
import { SignupPage } from "./routes/signup";
import { LoginPage } from "./routes/login";


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
        path: '/create-workspace',
        element: <h1>Create workspace page for new users</h1>
    },
    {
        path: '/w/:workspaceSlug',
        element: <h1>the workspace layout and an outlet for children</h1>,
        children: [
            {
                index: true,
                element: <h1>Workspace dashboard</h1>
            },
            {
                path: 'projects',
                element: <h1>Project Layout</h1>,
                children: [
                    {
                        index: true,
                        element: <h1>List of all projects</h1>
                    },
                    {
                        path: ":projectSlug",
                        element: <h1>Kanban Board of that project</h1>
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