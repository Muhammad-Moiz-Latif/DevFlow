import axios from "axios";
import { useAuthStore } from "../stores/auth-store";


export const publicApi = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true
});

export const privateApi = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true
});


privateApi.interceptors.request.use((config) => {
    const token = useAuthStore.getState().accessToken
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
});


privateApi.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true
            try {
                const response = await publicApi.get('/auth/refresh-access-token');
                const newAccessToken = response.data.access_token;
                useAuthStore.getState().setAccessToken(newAccessToken);
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                return privateApi(originalRequest)
            } catch {
                useAuthStore.getState().clearAuth();
                if (window.location.pathname !== '/login') {
                    window.location.href = '/login'
                }
            }
        }

        return Promise.reject(error);
    }
)