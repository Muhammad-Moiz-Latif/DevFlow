// components/invitation-states/DifferentAccountState.tsx
import { LogOut, AlertCircle } from "lucide-react";
import logo from "../../../../assets/logo.png";
import { Link } from "react-router";

type DifferentAccountStateProps = {
    currentEmail?: string;
    invitedEmail?: string;
    invitedUserExists: boolean;
    onLogout: () => void;
};

export const DifferentAccountState = ({
    currentEmail,
    invitedEmail,
    invitedUserExists,
    onLogout
}: DifferentAccountStateProps) => {
    return (
        <div className="min-h-screen flex bg-background text-foreground">
            {/* ───────── Left: Form ───────── */}
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

                {/* Content */}
                <div className="relative flex-1 flex items-center justify-center">
                    <div className="w-full max-w-[420px]">
                        <div className="inline-flex items-center gap-3 mb-5 text-[10px] font-mono tracking-[0.16em] text-muted-foreground/55 uppercase">
                            <span className="w-4 h-px bg-border" />
                            Fig. 09 — Account Mismatch
                            <span className="w-4 h-px bg-border" />
                        </div>

                        {/* Warning Card */}
                        <div className="border border-border bg-card overflow-hidden">
                            <div className="h-9 border-b border-border bg-sidebar/40 flex items-center px-3.5 gap-2.5">
                                <AlertCircle className="size-3.5 text-amber-500" strokeWidth={1.8} />
                                <span className="text-[10px] font-mono tracking-wide text-muted-foreground/60 uppercase">
                                    Account Mismatch
                                </span>
                                <span className="ml-auto flex items-center gap-1.5 text-[9px] font-mono text-amber-500/70">
                                    <span className="size-1 rounded-full bg-amber-500 animate-pulse" />
                                    Action Required
                                </span>
                            </div>

                            <div className="p-5 space-y-4">
                                <div>
                                    <h1 className="text-[1.15rem] font-semibold tracking-[-0.02em] leading-snug text-foreground">
                                        Wrong account
                                    </h1>
                                    <p className="text-[12px] text-muted-foreground/60 mt-1">
                                        The invitation was sent to a different email address.
                                    </p>
                                </div>

                                {/* Account details */}
                                <div className="space-y-2.5 bg-surface/30 rounded-lg p-3.5 border border-border/40">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[9px] font-mono tracking-[0.08em] text-muted-foreground/40 uppercase">
                                            Current account
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <div className="size-5 rounded-full bg-gradient-to-br from-sky-400 to-indigo-600 flex items-center justify-center text-[8px] font-mono text-white">
                                                {currentEmail?.charAt(0).toUpperCase() || '?'}
                                            </div>
                                            <span className="text-[12px] font-medium text-foreground/80">
                                                {currentEmail}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="w-full h-px bg-border/50" />

                                    <div className="flex items-center justify-between">
                                        <span className="text-[9px] font-mono tracking-[0.08em] text-muted-foreground/40 uppercase">
                                            Invited email
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <div className="size-5 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-[8px] font-mono text-amber-600">
                                                {invitedEmail?.charAt(0).toUpperCase() || '?'}
                                            </div>
                                            <span className="text-[12px] font-medium text-amber-600">
                                                {invitedEmail}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <p className="text-[11.5px] text-muted-foreground/70 leading-relaxed">
                                    {invitedUserExists
                                        ? `Log out and sign in as ${invitedEmail} to accept this invitation.`
                                        : `Log out and create an account with ${invitedEmail} to accept this invitation.`}
                                </p>

                                {/* Actions */}
                                <button
                                    onClick={onLogout}
                                    className="group w-full inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 h-9 text-[12px] font-medium hover:bg-primary/90 transition-colors"
                                >
                                    <LogOut className="size-3.5" strokeWidth={2} />
                                    Log out and continue
                                    <span className="text-[9px] font-mono text-primary-foreground/60 ml-1">
                                        →
                                    </span>
                                </button>
                            </div>
                        </div>

                        <p className="text-[10px] font-mono text-muted-foreground/40 text-center mt-6 tracking-wide">
                            You'll be redirected to the login page
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
                {["top-5 left-5 border-t border-l", "top-5 right-5 border-t border-r", "bottom-5 left-5 border-b border-l", "bottom-5 right-5 border-b border-r"].map((pos) => (
                    <div key={pos} className={`absolute ${pos} size-2.5 border-primary/40`} />
                ))}
                <div className="relative z-10 flex flex-col items-center justify-center w-full h-full px-14">
                    <div className="w-full max-w-xl">
                        <div className="inline-flex items-center gap-3 mb-6 text-[10px] font-mono tracking-[0.16em] text-muted-foreground/55 uppercase">
                            <span className="w-4 h-px bg-border" />
                            Fig. B — Authentication
                            <span className="w-4 h-px bg-border" />
                        </div>
                        <h2 className="text-[1.7rem] font-semibold tracking-[-0.03em] leading-[1.15] text-center">
                            Sign in with the right account.
                        </h2>
                        <p className="text-[13.5px] text-muted-foreground mt-4 leading-relaxed text-center">
                            This invitation was sent to a specific email address. Please sign in with the correct account to accept.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};