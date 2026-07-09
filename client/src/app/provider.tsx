import { RouterProvider } from "react-router"
import { router } from "./router"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { AuthProvider } from "../context/authContext";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import { useAuthStore } from "../stores/auth-store";
import { privateApi } from "../lib/axios";
import { GoogleOAuthProvider } from "@react-oauth/google";

const queryClient = new QueryClient();

export const CustomProvider = () => {
    const accessToken = useAuthStore((state) => state.accessToken)
    const setAuth = useAuthStore((state) => state.setAuth)
    const clearAuth = useAuthStore((state) => state.clearAuth)

    useEffect(() => {
        async function getMyData() {
            try {
                const token = useAuthStore.getState().accessToken;
                if (!token) return;
                const response = await privateApi.get('/auth/me');
                if (response.data.success) {
                    setAuth({
                        _id: response.data.data.id,
                        image: response.data.data.img,
                        username: response.data.data.name
                    }, token)
                }
            } catch (error) {
                console.error(error);
                clearAuth();
            }
        };

        getMyData();
    }, [accessToken]);


    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
                    <Toaster />
                    <RouterProvider router={router} />
                </GoogleOAuthProvider>
            </AuthProvider>
        </QueryClientProvider>
    )
}