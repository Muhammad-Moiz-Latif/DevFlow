import { useEffect } from "react";

// components/invitation-states/SignInRequiredState.tsx
type SignInRequiredStateProps = {
    workspaceName?: string;
    onRedirect: () => void;
};

export const SignInRequiredState = ({ workspaceName, onRedirect }: SignInRequiredStateProps) => {
    useEffect(() => {
        const timer = setTimeout(onRedirect, 1500);
        return () => clearTimeout(timer);
    }, [onRedirect]);

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
            <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50">
                    <svg className="h-6 w-6 text-indigo-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l3 3m0 0l-3 3m3-3H3" />
                    </svg>
                </div>
                <h2 className="text-lg font-semibold text-slate-900">
                    Sign in to accept this invitation
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                    {workspaceName
                        ? `You already have an account. Sign in to join ${workspaceName}.`
                        : "You already have an account. Sign in to continue."}
                </p>
                <p className="mt-4 text-xs text-slate-400">Redirecting you to login…</p>
            </div>
        </div>
    );
};