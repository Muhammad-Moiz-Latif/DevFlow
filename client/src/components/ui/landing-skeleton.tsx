// LoadingSkeleton.tsx
import { useEffect, useState } from "react";

export function LoadingSkeleton() {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return prev + 2;
            });
        }, 40);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
            {/* Nav Skeleton */}
            <header className="fixed top-0 left-0 right-0 z-50">
                <div className="max-w-300 mx-auto sm:px-6 pt-4">
                    <div className="h-14 px-3 sm:px-4 flex items-center justify-between rounded-xl border border-border/50 bg-background/75 backdrop-blur-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
                        {/* Brand */}
                        <div className="flex items-center gap-2.5">
                            <div className="size-8 rounded-md bg-border/60 animate-pulse" />
                            <div className="flex items-baseline gap-[1px]">
                                <span className="text-[15px] font-semibold tracking-tight text-slate-100">
                                    Dev
                                </span>
                                <span className="font-mono text-[13px] font-medium text-[oklch(0.72_0.20_290)]">
                                    FLOW
                                </span>
                            </div>
                        </div>

                        {/* Nav links */}
                        <nav className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
                            {["Features", "Workflow", "Pricing"].map((item) => (
                                <div
                                    key={item}
                                    className="px-3 py-1.5 rounded-md h-[30px] w-[60px] bg-border/40 animate-pulse"
                                />
                            ))}
                        </nav>

                        {/* Actions */}
                        <div className="flex items-center gap-1.5">
                            <div className="hidden sm:inline-flex h-9 w-[70px] bg-border/40 animate-pulse rounded-lg" />
                            <div className="h-9 w-[100px] bg-primary/40 animate-pulse rounded-lg" />
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Skeleton */}
            <section className="relative pt-24 pb-28 px-4 sm:px-6 overflow-hidden">
                {/* Outer drafting sheet */}
                <div className="absolute inset-4 md:inset-8 -z-10 rounded-xl border border-border/40 bg-background/40">
                    {/* Grid lines */}
                    <div
                        className="absolute inset-0 opacity-[0.045]"
                        style={{
                            backgroundImage: `
                                linear-gradient(oklch(1 0 0 / 1) 1px, transparent 1px),
                                linear-gradient(90deg, oklch(1 0 0 / 1) 1px, transparent 1px)
                            `,
                            backgroundSize: "40px 40px",
                        }}
                    />
                </div>

                {/* Registration marks */}
                {[
                    "top-3 left-3 border-t border-l",
                    "top-3 right-3 border-t border-r",
                    "bottom-3 left-3 border-b border-l",
                    "bottom-3 right-3 border-b border-r",
                ].map((pos) => (
                    <div
                        key={pos}
                        className={`absolute ${pos} size-2.5 border-primary/20 -z-10`}
                    />
                ))}

                {/* Content */}
                <div className="max-w-3xl mx-auto text-center pt-3">
                    {/* Annotation label */}
                    <div className="inline-flex items-center gap-3 mb-7">
                        <span className="w-5 h-px bg-border" />
                        <div className="h-[10px] w-[80px] bg-border/40 animate-pulse" />
                        <span className="w-5 h-px bg-border" />
                    </div>

                    {/* Headline */}
                    <div className="space-y-2">
                        <div className="h-[40px] md:h-[50px] w-[80%] mx-auto bg-border/40 animate-pulse rounded" />
                        <div className="h-[40px] md:h-[50px] w-[70%] mx-auto bg-border/30 animate-pulse rounded" />
                    </div>

                    {/* Scale bar */}
                    <div className="mt-8 mb-8 flex justify-center">
                        <div className="flex items-end gap-[3px]">
                            {Array.from({ length: 17 }).map((_, i) => (
                                <span
                                    key={i}
                                    className="bg-border/30"
                                    style={{
                                        width: "1px",
                                        height: i % 4 === 0 ? "11px" : i % 2 === 0 ? "7px" : "4px",
                                    }}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Subtitle */}
                    <div className="space-y-1.5">
                        <div className="h-[14px] w-[60%] mx-auto bg-border/40 animate-pulse rounded" />
                        <div className="h-[14px] w-[50%] mx-auto bg-border/30 animate-pulse rounded" />
                    </div>

                    {/* CTAs */}
                    <div className="mt-9 flex items-center justify-center gap-2.5">
                        <div className="h-9.5 w-[150px] bg-primary/40 animate-pulse rounded-md" />
                        <div className="h-9.5 w-[140px] bg-border/40 animate-pulse rounded-md" />
                    </div>

                    <div className="mt-5 h-[10px] w-[180px] mx-auto bg-border/30 animate-pulse rounded" />
                </div>

                {/* Product block */}
                <div className="max-w-6xl mx-auto mt-20 relative">
                    <div className="flex items-center justify-between mb-3 px-1">
                        <div className="h-[10px] w-[100px] bg-border/30 animate-pulse" />
                        <div className="h-[10px] w-[80px] bg-border/30 animate-pulse" />
                    </div>

                    <div className="relative border border-border/60 bg-surface/20 p-1">
                        <div className="border border-border/40 bg-background overflow-hidden">
                            {/* Board preview skeleton */}
                            <div className="bg-card">
                                {/* Title bar */}
                                <div className="h-8 border-b border-border bg-sidebar/80 flex items-center px-3.5 gap-3">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <div
                                            key={i}
                                            className="h-[8px] w-[50px] bg-border/40 animate-pulse"
                                        />
                                    ))}
                                    <div className="h-[8px] w-[100px] bg-border/30 animate-pulse ml-auto" />
                                </div>

                                {/* Board columns */}
                                <div className="grid grid-cols-4 gap-px bg-border/80">
                                    {[1, 2, 3, 4].map((col) => (
                                        <div key={col} className="min-w-0 bg-background p-3.5">
                                            <div className="flex items-center gap-1.5 mb-2.5">
                                                <div className="size-1.5 rounded-full bg-border/40 animate-pulse" />
                                                <div className="h-[10px] w-[50px] bg-border/40 animate-pulse" />
                                                <div className="h-[9px] w-[15px] bg-border/30 animate-pulse ml-auto" />
                                            </div>
                                            <div className="space-y-1.5">
                                                {[1, 2, 3].map((card) => (
                                                    <div
                                                        key={card}
                                                        className="rounded border border-border/70 bg-card p-2"
                                                    >
                                                        <div className="flex items-center gap-1.5 mb-1">
                                                            <div className="size-1 rounded-[1px] bg-border/40 animate-pulse" />
                                                            <div className="h-[8px] w-[35px] bg-border/30 animate-pulse" />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <div className="h-[10px] w-[80%] bg-border/30 animate-pulse rounded" />
                                                            <div className="h-[10px] w-[60%] bg-border/20 animate-pulse rounded" />
                                                        </div>
                                                        <div className="flex items-center justify-between mt-1.5">
                                                            <div className="flex -space-x-1">
                                                                <div className="size-3.5 rounded-full bg-border/40 animate-pulse ring-1 ring-card" />
                                                            </div>
                                                            <div className="h-[8px] w-[30px] bg-border/30 animate-pulse" />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Loading Progress Bar */}
            <div className="fixed bottom-0 left-0 right-0 z-50">
                <div className="max-w-300 mx-auto px-4 pb-4">
                    <div className="relative h-[2px] bg-border/30 rounded-full overflow-hidden">
                        <div
                            className="absolute inset-0 bg-primary transition-all duration-200 ease-out rounded-full"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <div className="flex justify-between mt-1.5 px-0.5">
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