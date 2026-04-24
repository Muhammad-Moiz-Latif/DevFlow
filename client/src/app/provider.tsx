import { RouterProvider } from "react-router"
import { router } from "./router"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

export const CustomProvider = () => {
    const queryClient = new QueryClient();
    return (
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
        </QueryClientProvider>
    )
}