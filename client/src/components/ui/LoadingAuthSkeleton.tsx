// LoadingAuthSkeleton.tsx
import { useEffect, useState } from "react";

interface LoadingAuthSkeletonProps {
    variant?: "login" | "signup";
}

export function LoadingAuthSkeleton({ variant = "login" }: LoadingAuthSkeletonProps) {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return prev + 1.5;
            });
        }, 30);
        return () => clearInterval(interval);
    }, []);

    const isSignup = variant === "signup";

    return (
        <div className="min-h-screen flex bg-background text-foreground">
            {/* ───────── Left: Form Skeleton ───────── */}
            <div className="flex-1 flex flex-col px-6 py-7 relative">
                {/* Brand */}
                <div className="relative flex items-center gap-2.5">
                    <div className="size-7 rounded-md bg-border/60 animate-pulse" />
                    <div className="flex items-baseline gap-[1px]">
                        <span className="text-[14px] font-semibold tracking-tight text-slate-100">
                            Dev
                        </span>
                        <span className="font-mono text-[12.5px] font-medium text-primary/50">
                            FLOW
                        </span>
                    </div>
                </div>

                {/* Form block */}
                <div className="relative flex-1 flex items-center justify-center">
                    <div className="w-full max-w-[340px]">
                        {/* Fig label */}
                        <div className="inline-flex items-center gap-3 mb-5">
                            <span className="w-4 h-px bg-border" />
                            <div className="h-[10px] w-[70px] bg-border/30 animate-pulse" />
                            <span className="w-4 h-px bg-border" />
                        </div>

                        {/* Title */}
                        <div className="space-y-2">
                            <div className="h-[28px] w-[180px] bg-border/40 animate-pulse rounded" />
                            <div className="h-[14px] w-[220px] bg-border/30 animate-pulse rounded" />
                        </div>

                        {/* Form fields */}
                        <div className="mt-7 space-y-4">
                            {/* Google button */}
                            <div className="h-9 w-full bg-border/30 animate-pulse rounded-md" />

                            {/* Divider */}
                            <div className="flex items-center gap-3 my-5">
                                <div className="flex-1 h-px bg-border/50" />
                                <div className="h-[10px] w-[20px] bg-border/30 animate-pulse" />
                                <div className="flex-1 h-px bg-border/50" />
                            </div>

                            {/* Username field (signup only) */}
                            {isSignup && (
                                <div className="space-y-1.5">
                                    <div className="h-[11px] w-[60px] bg-border/30 animate-pulse rounded" />
                                    <div className="h-10 w-full bg-border/25 animate-pulse rounded-md" />
                                </div>
                            )}

                            {/* Email field */}
                            <div className="space-y-1.5">
                                <div className="h-[11px] w-[40px] bg-border/30 animate-pulse rounded" />
                                <div className="h-10 w-full bg-border/25 animate-pulse rounded-md" />
                            </div>

                            {/* Profile picture (signup only) */}
                            {isSignup && (
                                <div className="flex items-center gap-4 py-1">
                                    <div className="w-14 h-14 rounded-full border-2 border-dashed border-border/40 bg-border/20 animate-pulse" />
                                    <div className="space-y-1">
                                        <div className="h-[13px] w-[80px] bg-border/30 animate-pulse rounded" />
                                        <div className="h-[11px] w-[160px] bg-border/20 animate-pulse rounded" />
                                    </div>
                                </div>
                            )}

                            {/* Password field */}
                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between">
                                    <div className="h-[11px] w-[60px] bg-border/30 animate-pulse rounded" />
                                    {!isSignup && (
                                        <div className="h-[10px] w-[90px] bg-border/20 animate-pulse rounded" />
                                    )}
                                </div>
                                <div className="h-10 w-full bg-border/25 animate-pulse rounded-md" />
                            </div>

                            {/* Confirm password (signup only) */}
                            {isSignup && (
                                <div className="space-y-1.5">
                                    <div className="h-[11px] w-[110px] bg-border/30 animate-pulse rounded" />
                                    <div className="h-10 w-full bg-border/25 animate-pulse rounded-md" />
                                </div>
                            )}

                            {/* Submit button */}
                            <div className="h-10 w-full bg-primary/40 animate-pulse rounded-md mt-1" />

                            {/* Footer link */}
                            <div className="h-[11px] w-[200px] mx-auto bg-border/20 animate-pulse rounded mt-4" />
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="relative text-center">
                    <div className="h-[11px] w-[280px] mx-auto bg-border/20 animate-pulse rounded" />
                </div>
            </div>

            {/* ───────── Right: Drafting panel Skeleton ───────── */}
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
                        className={`absolute ${pos} size-2.5 border-primary/20`}
                    />
                ))}

                {/* Centered content */}
                <div className="relative z-10 flex flex-col items-center justify-center w-full h-full px-14">
                    <div className="w-full max-w-xl">
                        {/* Fig label */}
                        <div className="inline-flex items-center gap-3 mb-6">
                            <span className="w-4 h-px bg-border" />
                            <div className="h-[10px] w-[70px] bg-border/30 animate-pulse" />
                            <span className="w-4 h-px bg-border" />
                        </div>

                        {/* Title */}
                        <div className="space-y-3 text-center">
                            <div className="h-[28px] w-[80%] mx-auto bg-border/40 animate-pulse rounded" />
                            <div className="h-[28px] w-[60%] mx-auto bg-border/30 animate-pulse rounded" />
                        </div>

                        {/* Subtitle */}
                        <div className="mt-4 space-y-1.5">
                            <div className="h-[14px] w-[70%] mx-auto bg-border/25 animate-pulse rounded" />
                            <div className="h-[14px] w-[50%] mx-auto bg-border/20 animate-pulse rounded" />
                        </div>

                        {/* Issue preview */}
                        <div className="mt-9 border border-border bg-card overflow-hidden max-w-md mx-auto">
                            <div className="h-7 border-b border-border bg-sidebar/80 flex items-center px-3 gap-2.5">
                                {[1, 2, 3].map((i) => (
                                    <div
                                        key={i}
                                        className="h-[9px] w-[40px] bg-border/40 animate-pulse"
                                    />
                                ))}
                                <div className="ml-auto flex items-center gap-1.5">
                                    <div className="size-1 rounded-full bg-border/40 animate-pulse" />
                                    <div className="h-[9px] w-[50px] bg-border/30 animate-pulse" />
                                </div>
                            </div>

                            {/* Issue 1 */}
                            <div className="p-3 border-b border-border/60 space-y-1.5">
                                <div className="flex items-center gap-1.5">
                                    <div className="size-1 rounded-[1px] bg-border/40 animate-pulse" />
                                    <div className="h-[9px] w-[45px] bg-border/30 animate-pulse" />
                                    <div className="ml-auto h-[9px] w-[30px] bg-border/20 animate-pulse" />
                                </div>
                                <div className="h-[12px] w-[80%] bg-border/30 animate-pulse rounded" />
                                <div className="flex items-center justify-between mt-2">
                                    <div className="flex items-center gap-1.5">
                                        <div className="size-1.5 rounded-full bg-border/40 animate-pulse" />
                                        <div className="h-[10px] w-[60px] bg-border/25 animate-pulse" />
                                    </div>
                                    <div className="size-4 border border-border bg-border/30 animate-pulse" />
                                </div>
                            </div>

                            {/* Issue 2 */}
                            <div className="p-3 space-y-1.5">
                                <div className="flex items-center gap-1.5">
                                    <div className="size-1 rounded-[1px] bg-border/40 animate-pulse" />
                                    <div className="h-[9px] w-[45px] bg-border/30 animate-pulse" />
                                </div>
                                <div className="h-[12px] w-[70%] bg-border/30 animate-pulse rounded" />
                                <div className="flex items-center justify-between mt-2">
                                    <div className="flex items-center gap-1.5">
                                        <div className="size-1.5 rounded-full bg-border/40 animate-pulse" />
                                        <div className="h-[10px] w-[60px] bg-border/25 animate-pulse" />
                                    </div>
                                    <div className="size-4 border border-border bg-border/30 animate-pulse" />
                                </div>
                            </div>
                        </div>

                        {/* Bottom annotation */}
                        <div className="mt-6 flex items-center justify-center gap-6">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-[9px] w-[60px] bg-border/20 animate-pulse" />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Loading Progress Bar */}
            <div className="fixed bottom-0 left-0 right-0 z-50">
                <div className="max-w-screen-2xl mx-auto px-4 pb-3">
                    <div className="relative h-[2px] bg-border/30 rounded-full overflow-hidden">
                        <div
                            className="absolute inset-0 bg-primary transition-all duration-200 ease-out rounded-full"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <div className="flex justify-between mt-1 px-0.5">
                        <span className="text-[8px] font-mono tracking-[0.12em] text-muted-foreground/40 uppercase">
                            Loading surface
                        </span>
                        <span className="text-[8px] font-mono tracking-[0.12em] text-muted-foreground/40">
                            {progress}%
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}