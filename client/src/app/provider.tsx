import { RouterProvider } from "react-router"
import { router } from "./router"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { AuthProvider } from "../context/authContext";
import { Toaster } from "react-hot-toast";

export const CustomProvider = () => {
    const queryClient = new QueryClient();
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <Toaster />
                <RouterProvider router={router} />
            </AuthProvider>
        </QueryClientProvider>
    )
}