import { useState, type Dispatch, type SetStateAction } from "react";
import { publicApi } from "../../../lib/axios";
import { useAuthStore } from "../../../stores/auth-store";
import { useNavigate } from "react-router";

export const ConfirmRejectModal = ({ setWarning, data }: { setWarning: Dispatch<SetStateAction<boolean>>, data: { invitationId: string | undefined, workspaceId: string | undefined } }) => {
    const { accessToken } = useAuthStore();
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    async function handleRejection() {
        try {
            setIsLoading(true);
            const response = await publicApi.delete(`/workspace/${data.workspaceId}/invitations/${data.invitationId}`);
            if (response.data && response) {
                if (!accessToken) {
                    navigate('/login')
                } else {
                    navigate(-1)
                }
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false)
        }
    };


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="w-full max-w-sm rounded-xl bg-white p-6 text-center shadow-lg">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-50">
                    <svg
                        className="h-6 w-6 text-amber-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                        />
                    </svg>
                </div>

                <h2 className="text-lg font-semibold text-slate-900">
                    Reject this invitation?
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                    Once rejected, this invitation link will be permanently discarded and can't be used
                    to join later. The workspace admin will need to send you a new invitation if you
                    change your mind.
                </p>

                <div className="mt-6 flex gap-3">
                    <button
                        onClick={() => setWarning((prev) => !prev)}
                        // disabled={isLoading}
                        className="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors disabled:opacity-50"
                    >
                        Go back
                    </button>
                    <button
                        onClick={handleRejection}
                        disabled={isLoading}
                        className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors disabled:opacity-50"
                    >
                        {isLoading ? "Rejecting…" : "Yes, reject it"}
                    </button>
                </div>
            </div>
        </div>
    );
};