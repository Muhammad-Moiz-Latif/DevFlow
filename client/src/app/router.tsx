import { createBrowserRouter } from "react-router";
import { LandingPage } from "./routes/dashboard";
import { SignupPage } from "./routes/signup";
import { LoginPage } from "./routes/login";


export const router = createBrowserRouter([
    {
        path: '/',
        element: <LandingPage />
    },
    {
        path: 'login',
        element: <LoginPage />
    },
    {
        path: 'signup',
        element: <SignupPage />
    },
    {
        path: "*",
        element: <h1>404 Page not found</h1>
    }
]);