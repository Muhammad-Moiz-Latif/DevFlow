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
import { Loader2, Users, ArrowRight, X, Check, Mail, User, Calendar, Clock } from "lucide-react";
import logo from "../../../assets/logo.png";
import { Link } from "react-router";

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

const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
};

const formatRole = (role: string) => {
    return role.charAt(0) + role.slice(1).toLowerCase();
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
                    console.log(response.data.data);
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
            <SignInRequiredState
                workspaceName={invitationData.workspaceName}
                onRedirect={() => navigate('/login', { state: { email: invitationData.email, fromInvite: true } })}
            />
        )
    };

    // The invited member is using a different email , ask him to log to the email we have sent him
    if (invitationData?.userStatus === 'DIFFERENT_ACCOUNT') {
        return (
            <DifferentAccountState
                invitedEmail={invitationData.email}
                invitedUserExists={invitationData.InvitedUserExists}
                currentEmail={invitationData.currentEmail}
                onLogout={async () => {
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
                }}
            />
        )
    };

    // // The invited member has no account urge him to create an account
    if (invitationData?.userStatus === 'NO_ACCOUNT') {
        return (
            <NoAccountState
                invitedEmail={invitationData.email}
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
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="flex items-center gap-2.5 border border-border bg-card px-5 py-3">
                    <Loader2 className="size-3.5 animate-spin text-primary" />
                    <span className="text-[12px] font-mono tracking-wide text-muted-foreground">
                        Loading invitation…
                    </span>
                </div>
            </div>
        );
    }

    if (isWarned) {
        return <ConfirmRejectModal setWarning={setWarning} data={{ invitationId: invitationData?.id, workspaceId: invitationData?.workspaceId }} />
    }

    return (
        <div className="min-h-screen flex bg-background text-foreground">
            {/* ───────── Left: Invitation Form ───────── */}
            <div className="flex-1 flex flex-col px-6 py-7 relative">
                {/* Brand */}
                <Link to="/" className="relative flex items-center gap-2.5 group">
                    <img
                        src={logo}
                        alt="DevFlow"
                        className="size-7 object-contain"
                    />
                    <span className="text-[14px] font-semibold tracking-tight">
                        Dev<span className="font-mono text-[12.5px] font-medium text-primary">FLOW</span>
                    </span>
                </Link>

                {/* Invitation block */}
                <div className="relative flex-1 flex items-center justify-center">
                    <div className="w-full max-w-[420px]">
                        <div className="inline-flex items-center gap-3 mb-5 text-[10px] font-mono tracking-[0.16em] text-muted-foreground/55 uppercase">
                            <span className="w-4 h-px bg-border" />
                            Fig. 09 — Invitation
                            <span className="w-4 h-px bg-border" />
                        </div>

                        {/* Invitation Card */}
                        <div className="border border-border bg-card overflow-hidden">
                            {/* Header */}
                            <div className="h-9 border-b border-border bg-sidebar/40 flex items-center px-3.5 gap-2.5">
                                <Users className="size-3.5 text-muted-foreground/50" strokeWidth={1.8} />
                                <span className="text-[10px] font-mono tracking-wide text-muted-foreground/60 uppercase">
                                    Workspace Invitation
                                </span>
                                <span className="ml-auto flex items-center gap-1.5 text-[9px] font-mono text-primary/70">
                                    <span className="size-1 rounded-full bg-primary animate-pulse" />
                                    Pending
                                </span>
                            </div>

                            {/* Content */}
                            <div className="p-5 space-y-4">
                                {/* Workspace Name */}
                                <div>
                                    <h1 className="text-[1.15rem] font-semibold tracking-[-0.02em] leading-snug text-foreground">
                                        You're invited to join{' '}
                                        <span className="text-primary">{invitationData?.workspaceName}</span>
                                    </h1>
                                    <p className="text-[12px] text-muted-foreground/60 mt-1">
                                        Invited by {invitationData?.ownerName}
                                    </p>
                                </div>

                                {/* Details grid */}
                                <div className="grid grid-cols-2 gap-3 bg-surface/30 rounded-lg p-3.5 border border-border/40">
                                    <div className="space-y-0.5">
                                        <label className="text-[9px] font-mono tracking-[0.08em] text-muted-foreground/40 uppercase flex items-center gap-1.5">
                                            <Mail className="size-2.5" strokeWidth={1.5} />
                                            Email
                                        </label>
                                        <p className="text-[12px] font-medium text-foreground/80 truncate">
                                            {invitationData?.email}
                                        </p>
                                    </div>

                                    <div className="space-y-0.5">
                                        <label className="text-[9px] font-mono tracking-[0.08em] text-muted-foreground/40 uppercase flex items-center gap-1.5">
                                            <User className="size-2.5" strokeWidth={1.5} />
                                            Role
                                        </label>
                                        <p className="text-[12px] font-medium text-foreground/80">
                                            {formatRole(invitationData?.role || '')}
                                        </p>
                                    </div>

                                    <div className="space-y-0.5">
                                        <label className="text-[9px] font-mono tracking-[0.08em] text-muted-foreground/40 uppercase flex items-center gap-1.5">
                                            <Calendar className="size-2.5" strokeWidth={1.5} />
                                            Invited
                                        </label>
                                        <p className="text-[11px] text-muted-foreground/60">
                                            {invitationData?.createdAt ? formatDate(invitationData.createdAt) : '—'}
                                        </p>
                                    </div>

                                    <div className="space-y-0.5">
                                        <label className="text-[9px] font-mono tracking-[0.08em] text-muted-foreground/40 uppercase flex items-center gap-1.5">
                                            <Clock className="size-2.5" strokeWidth={1.5} />
                                            Expires
                                        </label>
                                        <p className="text-[11px] text-muted-foreground/60">
                                            {invitationData?.expiresAt ? formatDate(invitationData.expiresAt) : '—'}
                                        </p>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center justify-center gap-2.5 pt-2">
                                    <button
                                        onClick={() => setWarning((prev) => !prev)}
                                        className="group inline-flex items-center gap-1.5 border border-border/80 bg-card px-3.5 h-9 text-[12px] font-medium text-muted-foreground hover:text-foreground hover:border-border hover:bg-surface/40 transition-colors"
                                    >
                                        <X className="size-3.5 opacity-60 group-hover:opacity-100 transition-opacity" strokeWidth={1.8} />
                                        Decline
                                    </button>
                                    <button
                                        disabled={isPending}
                                        onClick={handleAccept}
                                        className="group inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 h-9 text-[12px] font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isPending ? (
                                            <>
                                                <Loader2 className="size-3.5 animate-spin" />
                                                Accepting…
                                            </>
                                        ) : (
                                            <>
                                                <Check className="size-3.5" strokeWidth={2.5} />
                                                Accept Invite
                                                <ArrowRight className="size-3.5 opacity-80 group-hover:translate-x-0.5 transition-transform" />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Footer note */}
                        <p className="text-[10px] font-mono text-muted-foreground/40 text-center mt-6 tracking-wide">
                            By accepting, you agree to join this workspace
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="relative text-[11px] text-muted-foreground/70 text-center leading-relaxed">
                    <span>DevFLOW © 2026</span>
                    <span className="mx-2 text-border">·</span>
                    <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
                    <span className="mx-2 text-border">·</span>
                    <a href="#" className="hover:text-foreground transition-colors">Terms</a>
                </div>
            </div>

            {/* ───────── Right: Drafting panel ───────── */}
            <div className="hidden lg:flex flex-1 border-l border-border bg-sidebar/40 relative overflow-hidden">
                {/* Grid */}
                <div
                    className="absolute inset-0 opacity-[0.04]"
                    style={{
                        backgroundImage: `
                            linear-gradient(oklch(1 0 0 / 1) 1px, transparent 1px),
                            linear-gradient(90deg, oklch(1 0 0 / 1) 1px, transparent 1px)
                        `,
                        backgroundSize: "40px 40px",
                    }}
                />

                {/* Registration marks */}
                {[
                    "top-5 left-5 border-t border-l",
                    "top-5 right-5 border-t border-r",
                    "bottom-5 left-5 border-b border-l",
                    "bottom-5 right-5 border-b border-r",
                ].map((pos) => (
                    <div
                        key={pos}
                        className={`absolute ${pos} size-2.5 border-primary/40`}
                    />
                ))}

                {/* Centered content */}
                <div className="relative z-10 flex flex-col items-center justify-center w-full h-full px-14">
                    <div className="w-full max-w-xl">
                        <div className="inline-flex items-center gap-3 mb-6 text-[10px] font-mono tracking-[0.16em] text-muted-foreground/55 uppercase">
                            <span className="w-4 h-px bg-border" />
                            Fig. A — Surface
                            <span className="w-4 h-px bg-border" />
                        </div>

                        <h2 className="text-[1.7rem] font-semibold tracking-[-0.03em] leading-[1.15] text-center">
                            Join your team on the same plane.
                        </h2>

                        <p className="text-[13.5px] text-muted-foreground mt-4 leading-relaxed text-center">
                            Workspaces, kanban, and threaded discussion that stay on the same surface.
                            Accept the invitation and start collaborating.
                        </p>

                        {/* Preview card */}
                        <div className="mt-9 border border-border bg-card overflow-hidden max-w-md mx-auto">
                            <div className="h-7 border-b border-border bg-sidebar/80 flex items-center px-3 gap-2.5 font-mono text-[9px] tracking-wide text-muted-foreground">
                                <span className="text-foreground/60">PROJECT</span>
                                <span className="text-foreground/80">{invitationData?.workspaceName || 'Workspace'}</span>
                                <span className="w-px h-2 bg-border" />
                                <span>INVITATION</span>
                                <span className="ml-auto flex items-center gap-1.5 text-primary">
                                    <span className="size-1 rounded-full bg-primary animate-pulse" />
                                    PENDING
                                </span>
                            </div>

                            <div className="p-3.5 space-y-2.5">
                                <div className="flex items-center gap-2.5">
                                    <div className="size-8 rounded-full bg-gradient-to-br from-sky-400 to-indigo-600 flex items-center justify-center text-[10px] font-mono text-white">
                                        {invitationData?.ownerName?.charAt(0).toUpperCase() || '?'}
                                    </div>
                                    <div>
                                        <p className="text-[11px] font-medium text-foreground/80">
                                            {invitationData?.ownerName || 'Team Member'}
                                        </p>
                                        <p className="text-[9px] font-mono text-muted-foreground/40">
                                            Invited you to join
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 text-[11px] text-foreground/70 bg-surface/30 p-2.5 rounded border border-border/40">
                                    <Users className="size-3 text-muted-foreground/40" strokeWidth={1.5} />
                                    <span>You've been invited as a <strong>{formatRole(invitationData?.role || '')}</strong></span>
                                </div>
                            </div>
                        </div>

                        {/* Bottom annotation */}
                        <div className="mt-6 flex items-center justify-center gap-6 text-[9px] font-mono tracking-[0.12em] text-muted-foreground/40 uppercase">
                            <span>Sheet 02 / 01</span>
                            <span className="w-px h-3 bg-border/60" />
                            <span>v2.0.1</span>
                            <span className="w-px h-3 bg-border/60" />
                            <span>devflow.app</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};