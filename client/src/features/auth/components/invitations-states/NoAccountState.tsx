// components/invitation-states/NoAccountState.tsx
type NoAccountStateProps = {
    workspaceName?: string;
    invitedEmail?: string;
    onRedirect: () => void;
};

export const NoAccountState = ({ workspaceName, invitedEmail, onRedirect }: NoAccountStateProps) => {
    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
            <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50">
                    <svg className="h-6 w-6 text-emerald-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM3 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 019.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
                    </svg>
                </div>
                <h2 className="text-lg font-semibold text-slate-900">
                    Create an account to accept
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                    {workspaceName
                        ? `You've been invited to join ${workspaceName}. Create an account with ${invitedEmail} to get started.`
                        : `Create an account with ${invitedEmail} to accept this invitation.`}
                </p>
                <button
                    onClick={onRedirect}
                    className="mt-6 w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
                >
                    Create account
                </button>
            </div>
        </div>
    );
};