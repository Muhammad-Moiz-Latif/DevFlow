import axios from "axios";
import { useAuthStore } from "../stores/auth-store";


export const publicApi = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const privateApi = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
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

        if ((error.response?.status === 401 || error.response?.status === 404) && !originalRequest._retry) {
            originalRequest._retry = true

            try {
                const response = await publicApi.post('/auth/refresh-access-token', null, { withCredentials: true });
                const newAccessToken = response.data.accessToken;

                useAuthStore.getState().setAccessToken(newAccessToken);
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                return privateApi(originalRequest)
            } catch {
                useAuthStore.getState().clearAuth()
                window.location.href = '/login'
            }
        }

        return Promise.reject(error)
    }
)