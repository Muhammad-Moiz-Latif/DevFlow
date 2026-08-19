import type { ReactNode } from "react";
import logo from "../../assets/logo.png";
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

                {/* Form block */}
                <div className="relative flex-1 flex items-center justify-center">
                    <div className="w-full max-w-[340px]">
                        <div className="inline-flex items-center gap-3 mb-5 text-[10px] font-mono tracking-[0.16em] text-muted-foreground/55 uppercase">
                            <span className="w-4 h-px bg-border" />
                            Fig. 08 — Sign In
                            <span className="w-4 h-px bg-border" />
                        </div>

                        <h1 className="text-[1.6rem] font-semibold tracking-[-0.03em] leading-tight">
                            {title}
                        </h1>
                        <p className="text-[13.5px] text-muted-foreground mt-1.5 leading-relaxed">
                            {subtitle}
                        </p>

                        <div className="mt-7">{children}</div>
                    </div>
                </div>

                {/* Footer */}
                <div className="relative text-[11px] text-muted-foreground/70 text-center leading-relaxed">
                    {footer}
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
                            A project tool that behaves like a drafting surface.
                        </h2>

                        <p className="text-[13.5px] text-muted-foreground mt-4 leading-relaxed text-center">
                            Workspaces, kanban, and threaded discussion that stay on the same plane.
                        </p>

                        {/* Issue preview — centered */}
                        <div className="mt-9 border border-border bg-card overflow-hidden max-w-md mx-auto">
                            <div className="h-7 border-b border-border bg-sidebar/80 flex items-center px-3 gap-2.5 font-mono text-[9px] tracking-wide text-muted-foreground">
                                <span className="text-foreground/60">PROJECT</span>
                                <span className="text-foreground/80">AURORA</span>
                                <span className="w-px h-2 bg-border" />
                                <span>LIVE</span>
                                <span className="ml-auto flex items-center gap-1.5 text-primary">
                                    <span className="size-1 rounded-full bg-primary animate-pulse" />
                                    3 ONLINE
                                </span>
                            </div>

                            <div className="p-3 border-b border-border/60">
                                <div className="flex items-center gap-1.5 mb-1">
                                    <span className="size-1 rounded-[1px] bg-priority-high" />
                                    <span className="text-[9px] font-mono text-muted-foreground/80">
                                        DEV-241
                                    </span>
                                    <span className="ml-auto text-[9px] font-mono text-primary tracking-wide">
                                        LIVE
                                    </span>
                                </div>
                                <div className="text-[12px] leading-snug text-foreground/85">
                                    Refactor OAuth flow for mobile
                                </div>
                                <div className="flex items-center justify-between mt-2">
                                    <div className="flex items-center gap-1.5">
                                        <span className="size-1.5 rounded-full bg-status-progress" />
                                        <span className="text-[10px] text-muted-foreground">In Progress</span>
                                    </div>
                                    <div className="size-4 flex items-center justify-center border border-border text-[8px] font-mono text-muted-foreground">
                                        RK
                                    </div>
                                </div>
                            </div>

                            <div className="p-3">
                                <div className="flex items-center gap-1.5 mb-1">
                                    <span className="size-1 rounded-[1px] bg-priority-medium" />
                                    <span className="text-[9px] font-mono text-muted-foreground/80">
                                        DEV-198
                                    </span>
                                </div>
                                <div className="text-[12px] leading-snug text-foreground/85">
                                    Fix race in presence indicator
                                </div>
                                <div className="flex items-center justify-between mt-2">
                                    <div className="flex items-center gap-1.5">
                                        <span className="size-1.5 rounded-full bg-status-review" />
                                        <span className="text-[10px] text-muted-foreground">In Review</span>
                                    </div>
                                    <div className="size-4 flex items-center justify-center border border-border text-[8px] font-mono text-muted-foreground">
                                        PS
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bottom annotation */}
                        <div className="mt-6 flex items-center justify-center gap-6 text-[9px] font-mono tracking-[0.12em] text-muted-foreground/40 uppercase">
                            <span>Sheet 02 / 01</span>
                            <span className="w-px h-3 bg-border/60" />
                            <span>v.2.0.1</span>
                            <span className="w-px h-3 bg-border/60" />
                            <span>devflow.app</span>
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
            className="w-full h-9 inline-flex items-center justify-center gap-2 border border-border bg-card text-[13px] font-medium hover:bg-surface transition-colors"
        >
            <svg className="size-3.5" viewBox="0 0 24 24">
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
            <span className="text-[10px] font-mono tracking-[0.14em] uppercase text-muted-foreground/55">
                {text}
            </span>
            <div className="flex-1 h-px bg-border" />
        </div>
    );
}