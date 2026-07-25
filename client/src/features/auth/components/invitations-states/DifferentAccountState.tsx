// components/invitation-states/DifferentAccountState.tsx
type DifferentAccountStateProps = {
    currentEmail?: string;
    invitedEmail?: string;
    invitedUserExists: boolean; // does the invited email have its own account?
    onLogout: () => void;
};

export const DifferentAccountState = ({
    currentEmail,
    invitedEmail,
    invitedUserExists,
    onLogout
}: DifferentAccountStateProps) => {
    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
            <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-50">
                    <svg className="h-6 w-6 text-amber-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                </div>
                <h2 className="text-lg font-semibold text-slate-900">
                    Wrong account
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                    You're signed in as <span className="font-medium text-slate-700">{currentEmail}</span>,
                    but this invitation was sent to <span className="font-medium text-slate-700">{invitedEmail}</span>.
                </p>
                <p className="mt-2 text-sm text-slate-500">
                    {invitedUserExists
                        ? `Log out and sign in as ${invitedEmail} to accept.`
                        : `Log out and create an account with ${invitedEmail} to accept.`}
                </p>
                <button
                    onClick={onLogout}
                    className="mt-6 w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
                >
                    Log out and continue
                </button>
            </div>
        </div>
    );
};