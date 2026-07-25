import { useGoogleLogin } from "@react-oauth/google";
import { publicApi } from "../lib/axios";
import type { LoginResponse } from "../features/types";
import { errorToast, successToast } from "../components/ui/CustomToasts";
import { useLocation, useNavigate } from "react-router";
import { useAuthStore } from "../stores/auth-store";
import { useState } from "react";
import { GeneralLoader } from "./loader";

export default function GoogleLoginButton({ label }: { label: string }) {
    const navigate = useNavigate();
    const { setAuth: setAuthStore } = useAuthStore();
    const [getUserId, setUserId] = useState("");
    const [googleMerge, setGoogleMerge] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const location = useLocation();
    const { fromInvite } = location.state || {};
    const invitationToken = sessionStorage.getItem('invitationToken');
    console.log(invitationToken, fromInvite)


    async function handleMerge() {
        try {
            setIsLoading(true);
            const response = await publicApi.patch<LoginResponse>('/auth/merge', { userId: getUserId });

            if (response.data.success && response.data.access_token) {
                successToast(`Welcome back, ${response.data.data?.username}`);

                setAuthStore({
                    _id: response.data.data?._id!,
                    image: response.data.data?.img!,
                    username: response.data.data?.username!,
                }, response.data.access_token);

                const workspaceSlug = response.data.defaultWorkspaceSlug;

                if (!workspaceSlug) {
                    setTimeout(() => navigate('/create-workspace'), 800);
                } else {
                    setTimeout(() => navigate(`/w/${workspaceSlug}`), 800);
                }
            }
        } catch (error) {
            console.error("Google login failed", error);
            errorToast('Google login failed');
        } finally {
            setIsLoading(false);
        }
    }

    const googleLogin = useGoogleLogin({
        flow: 'auth-code',
        onSuccess: async ({ code }) => {
            setIsLoading(true);
            try {
                const response = await publicApi.post<LoginResponse>('/auth/google', { code });
                if (response.status === 201) {
                    console.log(response);
                    setUserId(response.data.data?._id!);
                    setGoogleMerge(true);
                }
                if (response.data.success && response.data.access_token && response.status === 200) {
                    successToast(`Welcome back, ${response.data.data?.username}`);

                    setAuthStore({
                        _id: response.data.data?._id!,
                        image: response.data.data?.img!,
                        username: response.data.data?.username!,
                    }, response.data.access_token);

                    const workspaceSlug = response.data.defaultWorkspaceSlug;
                    if (invitationToken && fromInvite) {
                        setTimeout(() => navigate(`/accept-invitation?token=${invitationToken}`), 800);
                    } else if (!workspaceSlug) {
                        setTimeout(() => navigate('/create-workspace'), 800);
                    } else {
                        setTimeout(() => navigate(`/w/${workspaceSlug}`), 800);
                    }
                }
            } catch (error) {
                console.error("Google login failed", error);
                errorToast('Google login failed');
            } finally {
                setIsLoading(false);
            }
        },
        onError: (error) => {
            setIsLoading(false);
            console.error("Google OAuth error:", error);
            // Show error toast
        },
    });

    if (googleMerge) return <div
        className="h-screen w-full bg-black/40 backdrop-blur-xs flex justify-center items-center absolute top-1/2 left-1/2  -translate-x-1/2 -translate-y-1/2 rounded-md z-30">
        <div className="w-140 h-64 bg-gray-800 rounded-md p-4 text-sm text-center">
            <p>This Google account is connected to your existing email. Would you like to link them for easier login?</p>
            <div className="flex justify-center gap-3 items-center">
                <button className="border px-10 py-2" onClick={() => handleMerge()}>Yes</button>
                <button className="border px-10 py-2" onClick={() => setGoogleMerge(false)}>No</button>
            </div>
        </div>
    </div>

    if (isLoading) return <>
        {<GeneralLoader label="Signing you in" />}
    </>

    return (
        <button
            type="button"
            className="w-full h-9 inline-flex items-center justify-center gap-2 rounded-md bg-surface border border-border text-sm font-medium hover:bg-surface-elevated transition-colors hover:cursor-pointer"
            onClick={() => googleLogin()}
        >
            <svg className="size-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09Z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A10.997 10.997 0 0 0 12 23Z" />
                <path fill="#FBBC05" d="M5.84 14.1A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.44.34-2.1V7.06H2.18A10.997 10.997 0 0 0 1 12c0 1.78.43 3.46 1.18 4.94l3.66-2.84Z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38Z" />
            </svg>
            {label}
        </button>
    )
}