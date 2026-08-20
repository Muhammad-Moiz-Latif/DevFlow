import { RouterProvider } from "react-router"
import { router } from "./router"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { AuthProvider } from "../context/authContext";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import { useAuthStore } from "../stores/auth-store";
import { privateApi } from "../lib/axios";
import { GoogleOAuthProvider } from "@react-oauth/google";
import axios from "axios";
import { SocketProvider } from "../context/socketContext";

const queryClient = new QueryClient();

export const CustomProvider = () => {
    const setAuth = useAuthStore((state) => state.setAuth)
    const clearAuth = useAuthStore((state) => state.clearAuth)

    useEffect(() => {
        async function getMyData() {
            try {

                const response = await privateApi.get('/auth/me');
                if (response.data.success) {
                    const currentToken = useAuthStore.getState().accessToken;
                    if (!currentToken) {
                        clearAuth();
                        return;
                    }
                    setAuth({
                        _id: response.data.data.id,
                        image: response.data.data.img,
                        username: response.data.data.name,
                        email: response.data.data.email
                    }, currentToken);
                }
            } catch (error) {
                console.error('auth/me failed:', error);
                if (axios.isAxiosError(error)) {
                    console.log('status:', error.response?.status, 'data:', error.response?.data);
                }

                clearAuth();
            }
        }
        getMyData();
    }, []); // runs once on mount, not tied to accessToken


    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <SocketProvider>
                    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
                        <Toaster />
                        <RouterProvider router={router} />
                    </GoogleOAuthProvider>
                </SocketProvider>
            </AuthProvider>
        </QueryClientProvider>
    )
}