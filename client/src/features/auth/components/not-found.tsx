// pages/NotFound.tsx
import { Link } from "react-router";
import { ArrowLeft, Home, Compass, AlertTriangle } from "lucide-react";
import logo from "@/assets/logo.png";
import { useEffect, useState } from "react";

export function NotFound() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [gridOffset, setGridOffset] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 20;
            const y = (e.clientY / window.innerHeight - 0.5) * 20;
            setMousePosition({ x, y });
        };

        window.addEventListener('mousemove', handleMouseMove);

        // Animate grid drift
        const interval = setInterval(() => {
            setGridOffset(prev => ({
                x: (prev.x + 0.3) % 40,
                y: (prev.y + 0.3) % 40,
            }));
        }, 50);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            clearInterval(interval);
        };
    }, []);

    return (
        <div className="min-h-screen bg-background text-foreground overflow-hidden">
            {/* ───────────────── ANIMATED BACKGROUND ───────────────── */}
            <div className="fixed inset-0 z-0">
                {/* Grid lines with drift */}
                <div
                    className="absolute inset-0 opacity-[0.045]"
                    style={{
                        backgroundImage: `
                            linear-gradient(oklch(1 0 0 / 1) 1px, transparent 1px),
                            linear-gradient(90deg, oklch(1 0 0 / 1) 1px, transparent 1px)
                        `,
                        backgroundSize: "40px 40px",
                        backgroundPosition: `${gridOffset.x}px ${gridOffset.y}px`,
                    }}
                />

                {/* Radial glow */}
                <div
                    className="
                        absolute
                        left-1/2
                        top-1/2
                        -translate-x-1/2
                        -translate-y-1/2
                        w-[600px]
                        h-[400px]
                        rounded-full
                        bg-primary/[0.04]
                        blur-[120px]
                        pointer-events-none
                    "
                    style={{
                        transform: `translate(calc(-50% + ${mousePosition.x * 0.3}px), calc(-50% + ${mousePosition.y * 0.3}px))`,
                    }}
                />

                {/* Floating particles */}
                <div className="absolute inset-0 pointer-events-none">
                    {Array.from({ length: 30 }).map((_, i) => {
                        const size = 1 + Math.random() * 2;
                        const x = Math.random() * 100;
                        const y = Math.random() * 100;
                        const duration = 15 + Math.random() * 20;
                        const delay = Math.random() * 10;

                        return (
                            <div
                                key={i}
                                className="absolute rounded-full bg-primary/20"
                                style={{
                                    width: size,
                                    height: size,
                                    left: `${x}%`,
                                    top: `${y}%`,
                                    animation: `float-particle ${duration}s ease-in-out ${delay}s infinite`,
                                    opacity: 0.1 + Math.random() * 0.2,
                                }}
                            />
                        );
                    })}
                </div>
            </div>

            {/* ───────────────── REGISTRATION MARKS ───────────────── */}
            {[
                "top-6 left-6 border-t border-l",
                "top-6 right-6 border-t border-r",
                "bottom-6 left-6 border-b border-l",
                "bottom-6 right-6 border-b border-r",
            ].map((pos) => (
                <div
                    key={pos}
                    className={`fixed ${pos} size-4 border-primary/30 z-10 pointer-events-none`}
                />
            ))}

            {/* ───────────────── MAIN CONTENT ───────────────── */}
            <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-16">
                {/* Brand */}
                <Link
                    to="/"
                    className="absolute top-8 left-8 sm:top-10 sm:left-10 flex items-center gap-2.5 group"
                >
                    <img
                        src={logo}
                        alt="DevFlow logo"
                        className="size-7 object-contain transition-transform duration-200 group-hover:scale-105"
                    />
                    <span className="text-[14px] font-semibold tracking-tight flex items-baseline gap-[1px]">
                        Dev<span className="font-mono text-[12.5px] font-medium text-primary">FLOW</span>
                    </span>
                </Link>

                {/* ───────────────── ERROR CONTENT ───────────────── */}
                <div className="max-w-2xl mx-auto text-center">
                    {/* Figure label */}
                    <div className="inline-flex items-center gap-3 mb-8">
                        <span className="w-8 h-px bg-border" />
                        <span className="text-[9px] font-mono tracking-[0.2em] text-muted-foreground/50 uppercase">
                            Fig. 404 — Not Found
                        </span>
                        <span className="w-8 h-px bg-border" />
                    </div>

                    {/* 404 Number with glitch effect */}
                    <div className="relative mb-6">
                        <h1 className="
                            text-[8rem]
                            sm:text-[10rem]
                            md:text-[12rem]
                            font-bold
                            tracking-[-0.08em]
                            leading-none
                            text-transparent
                            bg-clip-text
                            bg-gradient-to-r
                            from-primary
                            via-primary/80
                            to-primary/40
                            select-none
                            relative
                        ">
                            404
                        </h1>

                        {/* Glitch overlay */}
                        <div
                            className="
                                absolute
                                inset-0
                                text-[8rem]
                                sm:text-[10rem]
                                md:text-[12rem]
                                font-bold
                                tracking-[-0.08em]
                                leading-none
                                text-primary/10
                                select-none
                                pointer-events-none
                                animate-glitch-1
                            "
                            style={{
                                clipPath: 'inset(20% 0 60% 0)',
                                transform: 'translateX(-4px)',
                            }}
                        >
                            404
                        </div>

                        <div
                            className="
                                absolute
                                inset-0
                                text-[8rem]
                                sm:text-[10rem]
                                md:text-[12rem]
                                font-bold
                                tracking-[-0.08em]
                                leading-none
                                text-primary/10
                                select-none
                                pointer-events-none
                                animate-glitch-2
                            "
                            style={{
                                clipPath: 'inset(60% 0 10% 0)',
                                transform: 'translateX(4px)',
                            }}
                        >
                            404
                        </div>
                    </div>

                    {/* Status badge */}
                    <div className="inline-flex items-center gap-2 mb-6 border border-border/60 bg-surface/30 px-3 py-1.5 rounded-full">
                        <AlertTriangle className="size-3 text-amber-500" strokeWidth={1.8} />
                        <span className="text-[9px] font-mono tracking-[0.12em] text-muted-foreground/60 uppercase">
                            Page not found
                        </span>
                        <span className="size-1 rounded-full bg-amber-500/50" />
                        <span className="text-[8px] font-mono text-amber-500/60">404</span>
                    </div>

                    {/* Message */}
                    <h2 className="
                        text-2xl
                        sm:text-3xl
                        font-semibold
                        tracking-[-0.03em]
                        leading-tight
                        mb-4
                    ">
                        The surface you're looking for
                        <br />
                        <span className="text-muted-foreground/50">
                            doesn't exist.
                        </span>
                    </h2>

                    <p className="
                        text-[13px]
                        sm:text-[14px]
                        text-muted-foreground
                        max-w-sm
                        mx-auto
                        leading-relaxed
                    ">
                        This workspace has been removed, never created,
                        or the coordinates are just slightly off.
                    </p>

                    {/* ───────────────── NAVIGATION ───────────────── */}
                    <div className="
                        mt-10
                        flex
                        flex-col
                        sm:flex-row
                        items-center
                        justify-center
                        gap-3
                    ">
                        <Link
                            to="/"
                            className="
                                group
                                h-10
                                px-5
                                rounded-md
                                bg-primary
                                text-primary-foreground
                                text-[13px]
                                font-medium
                                inline-flex
                                items-center
                                justify-center
                                gap-2
                                border
                                border-primary/70
                                shadow-lg
                                shadow-primary/10
                                hover:bg-primary/90
                                hover:shadow-primary/20
                                transition-all
                            "
                        >
                            <Home className="size-3.5" strokeWidth={1.8} />
                            Return to surface
                            <ArrowLeft className="
                                size-3.5
                                opacity-80
                                transition-transform
                                duration-200
                                group-hover:-translate-x-0.5
                            " />
                        </Link>

                        <Link
                            to="/app"
                            className="
                                h-10
                                px-5
                                rounded-md
                                border
                                border-border/80
                                bg-background/30
                                text-[13px]
                                font-medium
                                text-foreground/80
                                inline-flex
                                items-center
                                justify-center
                                gap-2
                                hover:bg-surface-elevated
                                hover:border-border
                                transition-colors
                            "
                        >
                            <Compass className="size-3.5" strokeWidth={1.8} />
                            Explore the system
                        </Link>
                    </div>

                    {/* ───────────────── TECHNICAL METADATA ───────────────── */}
                    <div className="
                        mt-10
                        flex
                        flex-wrap
                        items-center
                        justify-center
                        gap-x-4
                        gap-y-2
                        text-[8px]
                        font-mono
                        tracking-[0.12em]
                        text-muted-foreground/30
                        uppercase
                    ">
                        <span>ERROR / 404</span>
                        <span className="w-px h-3 bg-border/50" />
                        <span>PAGE / MISSING</span>
                        <span className="w-px h-3 bg-border/50" />
                        <span className="flex items-center gap-1.5 text-amber-500/60">
                            <span className="size-1 rounded-full bg-amber-500 animate-pulse" />
                            STATUS / NOT FOUND
                        </span>
                    </div>

                    {/* ───────────────── COORDINATES ───────────────── */}
                    <div className="
                        mt-8
                        flex
                        items-center
                        justify-center
                        gap-4
                        text-[7px]
                        font-mono
                        text-muted-foreground/20
                        tracking-[0.1em]
                    ">
                        <span>X: 0.000</span>
                        <span className="w-px h-2 bg-border/30" />
                        <span>Y: 0.000</span>
                        <span className="w-px h-2 bg-border/30" />
                        <span>Z: undefined</span>
                    </div>
                </div>

                {/* ───────────────── BOTTOM ANNOTATION ───────────────── */}
                <div className="
                    absolute
                    bottom-6
                    left-1/2
                    -translate-x-1/2
                    flex
                    items-center
                    gap-4
                    text-[7px]
                    font-mono
                    tracking-[0.12em]
                    text-muted-foreground/20
                    uppercase
                ">
                    <span>Sheet 404 / 01</span>
                    <span className="w-px h-2 bg-border/30" />
                    <span>Rev. 01</span>
                    <span className="w-px h-2 bg-border/30" />
                    <span>DevFlow / Core System</span>
                </div>
            </div>

            {/* ───────────────── KEYFRAMES ───────────────── */}
            <style dangerouslySetInnerHTML={{
                __html: `
                    @keyframes float-particle {
                        0%, 100% {
                            transform: translate(0, 0) scale(1);
                            opacity: 0.1;
                        }
                        25% {
                            transform: translate(20px, -30px) scale(1.5);
                            opacity: 0.3;
                        }
                        50% {
                            transform: translate(-15px, 20px) scale(0.8);
                            opacity: 0.15;
                        }
                        75% {
                            transform: translate(30px, 15px) scale(1.2);
                            opacity: 0.25;
                        }
                    }

                    @keyframes glitch-1 {
                        0%, 100% {
                            transform: translateX(-4px);
                            opacity: 0.3;
                        }
                        20% {
                            transform: translateX(-8px);
                            opacity: 0.5;
                        }
                        40% {
                            transform: translateX(2px);
                            opacity: 0.2;
                        }
                        60% {
                            transform: translateX(-6px);
                            opacity: 0.4;
                        }
                        80% {
                            transform: translateX(4px);
                            opacity: 0.3;
                        }
                    }

                    @keyframes glitch-2 {
                        0%, 100% {
                            transform: translateX(4px);
                            opacity: 0.3;
                        }
                        20% {
                            transform: translateX(8px);
                            opacity: 0.2;
                        }
                        40% {
                            transform: translateX(-2px);
                            opacity: 0.5;
                        }
                        60% {
                            transform: translateX(6px);
                            opacity: 0.3;
                        }
                        80% {
                            transform: translateX(-4px);
                            opacity: 0.4;
                        }
                    }

                    .animate-glitch-1 {
                        animation: glitch-1 2s ease-in-out infinite;
                    }

                    .animate-glitch-2 {
                        animation: glitch-2 2s ease-in-out infinite;
                    }
                `
            }} />
        </div>
    );
}