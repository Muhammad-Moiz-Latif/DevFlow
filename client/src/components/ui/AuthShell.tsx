import type { ReactNode } from "react";
import { CircleDot } from "lucide-react";
import { Link } from "react-router";

export function AuthShell({
    title,
    subtitle,
    children,
    footer,
}: {
    title: string;
    subtitle: string;
    children: ReactNode;
    footer: ReactNode;
}) {
    return (
        <div className="min-h-screen flex bg-background text-foreground">
            {/* Left: form */}
            <div className="flex-1 flex flex-col px-6 py-8">
                <Link to="/" className="flex items-center gap-2">
                    <div className="size-7 rounded-md bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                        <CircleDot className="size-4 text-primary-foreground" strokeWidth={2.5} />
                    </div>
                    <span className="text-sm font-semibold tracking-tight">DevFlow</span>
                </Link>

                <div className="flex-1 flex items-center justify-center">
                    <div className="w-full max-w-[360px]">
                        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
                        <p className="text-sm text-muted-foreground mt-1.5">{subtitle}</p>
                        <div className="mt-7">{children}</div>
                    </div>
                </div>

                <div className="text-xs text-muted-foreground text-center">{footer}</div>
            </div>
            

            {/* Right: visual panel */}
            <div className="hidden lg:flex flex-1 border-l border-border bg-sidebar relative overflow-hidden">
                <div className="absolute inset-0 opacity-[0.18]" style={{
                    backgroundImage:
                        "radial-gradient(circle at 20% 20%, oklch(0.72 0.18 280 / 0.6), transparent 40%), radial-gradient(circle at 80% 70%, oklch(0.68 0.17 240 / 0.5), transparent 45%)",
                }} />
                <div className="absolute inset-0" style={{
                    backgroundImage:
                        "linear-gradient(oklch(1 0 0 / 0.04) 1px, transparent 1px), linear-gradient(90deg, oklch(1 0 0 / 0.04) 1px, transparent 1px)",
                    backgroundSize: "32px 32px",
                }} />
                <div className="relative z-10 flex flex-col justify-center px-12 max-w-lg">
                    <div className="inline-flex items-center gap-1.5 text-[11px] font-medium text-primary mb-4">
                        <span className="size-1.5 rounded-full bg-primary animate-pulse" />
                        Real-time collaboration
                    </div>
                    <h2 className="text-3xl font-semibold tracking-tight leading-tight">
                        Ship faster with a tracker your team actually wants to use.
                    </h2>
                    <p className="text-sm text-muted-foreground mt-4 leading-relaxed">
                        Linear-grade kanban, threaded comments, and live presence — all in one
                        workspace. Built for product teams that move quickly.
                    </p>

                    {/* Mock issue card preview */}
                    <div className="mt-8 bg-card border border-border rounded-md p-3 shadow-2xl">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="inline-flex items-center justify-center size-5 rounded bg-priority-high/15">
                                <span className="size-2 rounded-sm bg-priority-high" />
                            </span>
                            <span className="text-[10px] font-mono text-muted-foreground">DEV-241</span>
                        </div>
                        <div className="text-sm leading-snug mb-2.5">
                            Refactor OAuth flow for mobile session persistence
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                            <span className="inline-flex items-center gap-1.5">
                                <span className="size-2 rounded-full bg-status-progress" />
                                In Progress
                            </span>
                            <div className="size-5 rounded-full bg-gradient-to-br from-rose-400 to-pink-600 ring-1 ring-background" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function GoogleButton({ label }: { label: string }) {
    return (
        <button
            type="button"
            className="w-full h-9 inline-flex items-center justify-center gap-2 rounded-md bg-surface border border-border text-sm font-medium hover:bg-surface-elevated transition-colors"
        >
            <svg className="size-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09Z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A10.997 10.997 0 0 0 12 23Z" />
                <path fill="#FBBC05" d="M5.84 14.1A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.44.34-2.1V7.06H2.18A10.997 10.997 0 0 0 1 12c0 1.78.43 3.46 1.18 4.94l3.66-2.84Z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38Z" />
            </svg>
            {label}
        </button>
    );
}

export function Divider({ text }: { text: string }) {
    return (
        <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-border" />
            <span className="text-[11px] uppercase tracking-wider text-muted-foreground">{text}</span>
            <div className="flex-1 h-px bg-border" />
        </div>
    );
}

export function Field({
    label,
    type = "text",
    placeholder,
    hint,
    rightAction,
    autoComplete,
}: {
    label: string;
    type?: string;
    placeholder?: string;
    hint?: string;
    rightAction?: ReactNode;
    autoComplete?: string;
}) {
    return (
        <div className="mb-2">
            <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-foreground/90">{label}</label>
                {rightAction}
            </div>
            <input
                type={type}
                placeholder={placeholder}
                autoComplete={autoComplete}
                className="w-full h-9 px-3 rounded-md bg-surface border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition-all"
            />
            {hint && <p className="text-[11px] text-muted-foreground mt-1">{hint}</p>}
        </div>
    );
}
