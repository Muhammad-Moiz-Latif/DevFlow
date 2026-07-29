import { useNavigate, useSearchParams } from "react-router"
import { useAuthStore } from "../../../stores/auth-store";
import { useEffect, useState } from "react";
import type { getWorkspaceInvitationResponse } from "../../types";
import { publicApi } from "../../../lib/axios";
import { errorToast, successToast } from "../../../components/ui/CustomToasts";
import axios from "axios";
import { ConfirmRejectModal } from "./rejectInvitationWarningModal";
import { SignInRequiredState } from "./invitations-states/SignInRequiredState";
import { DifferentAccountState } from "./invitations-states/DifferentAccountState";
import { Logout } from "../api/logout";
import { NoAccountState } from "./invitations-states/NoAccountState";
import { useAcceptInvite } from "../../members/query/useAcceptInvite";

type InvitationDataType = {
    id: string,
    workspaceId: string,
    email: string,
    role: 'ADMIN' | 'MEMBER' | 'VIEWER',
    token: string,
    invitedBy: string,
    expiresAt: Date,
    acceptedAt: Date,
    createdAt: Date,
    workspaceName: string,
    ownerName: string,
    InvitedUserExists: boolean,
    currentEmail: string | undefined,
    userStatus: "NO_ACCOUNT" | "SAME_ACCOUNT" | "DIFFERENT_ACCOUNT";
};

export const AcceptMemberInvitationModal = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const [invitationData, setInvitationData] = useState<InvitationDataType>();
    const [isLoading, setIsLoading] = useState(true);
    const { clearAuth } = useAuthStore();
    const [isWarned, setWarning] = useState(false);
    const navigate = useNavigate();
    const { mutate, isPending } = useAcceptInvite();
    const { accessToken } = useAuthStore();
        console.log(accessToken, invitationData?.userStatus)


    // Redirect logic moved into an effect — navigation is a side effect,
    // it should never happen directly in the render body.
    useEffect(() => {
        if (!token && !accessToken) {
            navigate('/login');
        } else if (!token && accessToken) {
            navigate(-1);
        }
    }, [token, accessToken]);

    useEffect(() => {
        if (!token) return;

        async function getInvitationData() {
            try {
                setIsLoading(true);
                const response = await publicApi.get<getWorkspaceInvitationResponse>('/invitations/get-workspace-invitation', {
                    params: { token, accessToken }
                });
                if (response.data.success) {
                    setInvitationData(response.data.data);
                    sessionStorage.setItem('invitationToken', token!)
                };
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    if (error.status === 400) {
                        errorToast("This invitation link is invalid or has expired.");
                        setTimeout(() => {
                            if (!accessToken) {
                                navigate('/login');
                            } else if (accessToken) {
                                navigate(-1);
                            }
                        }, 1000);
                    }
                }
            } finally {
                setIsLoading(false);
            }
        }
        getInvitationData();
    }, [token]);

    // The invited member has an account , we are requresting him to login to it
    if (invitationData?.userStatus === 'SAME_ACCOUNT' && !accessToken) {
        return (
            <SignInRequiredState workspaceName={invitationData.workspaceName}
                onRedirect={() => navigate('/login', { state: { email: invitationData.email, fromInvite: true } })}
            />
        )
    };

    // The invited member is using a different email , ask him to log to the email we have sent him
    if (invitationData?.userStatus === 'DIFFERENT_ACCOUNT') {
        return (
            <DifferentAccountState invitedEmail={invitationData.email} invitedUserExists={invitationData.InvitedUserExists} currentEmail={invitationData.currentEmail} onLogout={async () => {
                const { success } = await Logout();
                if (success) {
                    clearAuth();
                    successToast("You have been logged out");
                    setTimeout(() => {
                        navigate('/login');
                    }, 1500);
                } else {
                    errorToast("An error occurred");
                }
            }} />
        )
    };

    // The invited member has no account urge him to create an account
    if (invitationData?.userStatus === 'NO_ACCOUNT') {
        return (
            <NoAccountState invitedEmail={invitationData.email}
                onRedirect={() => navigate('/signup', { state: { email: invitationData.email, fromInvite: true } })}
            />
        )
    }

    const handleAccept = async () => {
        mutate(token, {
            onSuccess: (data) => {
                sessionStorage.removeItem('invitationToken');
                successToast('Redirecting to workspace');
                setTimeout(() => {
                    navigate(`/w/${data.data?.workspaceSlug}`);
                }, 1000);
            },

            onError: (error) => {
                if (axios.isAxiosError(error)) {
                    if (error.status === 400) {
                        errorToast('This invitations has expired');
                        setTimeout(() => {
                            accessToken ? navigate(-1) : navigate('/login')
                        }, 1000);
                    }
                };
            },
            onSettled: () => {
                sessionStorage.removeItem('invitationToken');
            }
        })
    };

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <p className="text-slate-500">Loading invitation…</p>
            </div>
        );
    }

    if (isWarned) {
        return <ConfirmRejectModal setWarning={setWarning} data={{ invitationId: invitationData?.id, workspaceId: invitationData?.workspaceId }} />
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
            <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 shadow-sm text-center">
                <h1 className="text-xl font-semibold text-slate-900">
                    You're invited to join <span className="text-indigo-600">{invitationData?.workspaceName}</span>
                </h1>
                <p className="mt-2 text-sm text-slate-500">
                    Invited by {invitationData?.ownerName}
                </p>
                <div className="mt-8 flex justify-center gap-3">
                    <button
                        onClick={() => setWarning((prev) => !prev)}
                        className="rounded-lg border hover:cursor-pointer border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                    >
                        Decline
                    </button>
                    <button

                        disabled={isPending}
                        onClick={handleAccept}
                        className="rounded-lg bg-indigo-600 hover:cursor-pointer px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
                    >
                        {isPending ? "Accepting..." : "Accept Invite"}
                    </button>
                </div>
            </div>
        </div>
    )
};