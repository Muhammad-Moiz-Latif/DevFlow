// components/invitation-states/SignInRequiredState.tsx
import { useEffect } from "react";
import { LogIn, ArrowRight } from "lucide-react";
import logo from "../../../../assets/logo.png";
import { Link } from "react-router";

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
                            Fig. 08 — Sign In Required
                            <span className="w-4 h-px bg-border" />
                        </div>

                        {/* Invitation Card */}
                        <div className="border border-border bg-card overflow-hidden">
                            <div className="h-9 border-b border-border bg-sidebar/40 flex items-center px-3.5 gap-2.5">
                                <LogIn className="size-3.5 text-primary" strokeWidth={1.8} />
                                <span className="text-[10px] font-mono tracking-wide text-muted-foreground/60 uppercase">
                                    Authentication Required
                                </span>
                                <span className="ml-auto flex items-center gap-1.5 text-[9px] font-mono text-primary/70">
                                    <span className="size-1 rounded-full bg-primary animate-pulse" />
                                    Redirecting…
                                </span>
                            </div>

                            <div className="p-5 space-y-4">
                                <div>
                                    <h1 className="text-[1.15rem] font-semibold tracking-[-0.02em] leading-snug text-foreground">
                                        Sign in to accept
                                    </h1>
                                    <p className="text-[12px] text-muted-foreground/60 mt-1">
                                        {workspaceName
                                            ? `You already have an account. Sign in to join ${workspaceName}.`
                                            : "You already have an account. Sign in to continue."}
                                    </p>
                                </div>

                                {/* Loading indicator */}
                                <div className="bg-surface/30 rounded-lg p-3.5 border border-border/40 flex items-center justify-between">
                                    <div className="flex items-center gap-2.5">
                                        <div className="size-5 rounded-full bg-gradient-to-br from-sky-400 to-indigo-600 flex items-center justify-center text-[8px] font-mono text-white animate-pulse">
                                            ✓
                                        </div>
                                        <span className="text-[12px] text-foreground/70">
                                            Account found for {workspaceName || 'workspace'}
                                        </span>
                                    </div>
                                    <span className="text-[9px] font-mono text-primary/60 animate-pulse">
                                        connecting…
                                    </span>
                                </div>

                                <div className="flex items-center justify-center gap-2 text-[11px] text-muted-foreground/50">
                                    <span className="animate-pulse">●</span>
                                    <span>Redirecting to login</span>
                                    <ArrowRight className="size-3 animate-pulse" strokeWidth={1.5} />
                                </div>
                            </div>
                        </div>

                        <p className="text-[10px] font-mono text-muted-foreground/40 text-center mt-6 tracking-wide">
                            You'll be redirected automatically
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
                            Fig. D — Authentication
                            <span className="w-4 h-px bg-border" />
                        </div>
                        <h2 className="text-[1.7rem] font-semibold tracking-[-0.03em] leading-[1.15] text-center">
                            Welcome back.
                        </h2>
                        <p className="text-[13.5px] text-muted-foreground mt-4 leading-relaxed text-center">
                            You already have an account. Sign in to accept the invitation and join your team.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};