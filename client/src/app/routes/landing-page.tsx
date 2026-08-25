import { useEffect, useState } from "react";
import logo from '../../assets/logo.png';
import { Hexagon, Triangle, Command, Cloud, Box, Activity } from "lucide-react";
import { LoadingSkeleton } from "../../components/ui/landing-skeleton";
import {
    ArrowRight,
    Zap,
    Users,
    Bell,
    Lock,
    Layers,
    Check
} from "lucide-react";
import { Link } from "react-router";
import { useShouldShowLoader } from "../../utils/useShouldShowLoader";
import { LandingBackground } from "@/components/ui/LandingBackground";

export function LandingPage() {
    const isLoading = useShouldShowLoader();

    if (isLoading) {
        return <LoadingSkeleton />;
    }
    // Smooth scroll function
    const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
        e.preventDefault();
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const navHeight = 64; // Approximate nav height
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
            <Nav onSmoothScroll={handleSmoothScroll} />
            <Hero />
            <LogoStrip />
            <Features />
            <BoardShowcase />
            <Workflow />
            <Pricing />
            <FinalCTA />
            <Footer onSmoothScroll={handleSmoothScroll} />
        </div>
    );
}

/* ---------------- NAV ---------------- */

function Nav({ onSmoothScroll }: { onSmoothScroll: (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => void }) {
    return (
        <header className="fixed top-0 left-0 right-0 z-50">
            <div className="max-w-300 mx-auto sm:px-6 pt-4">
                <div
                    className="
                            h-14 px-3 sm:px-4
                            flex items-center justify-between
                            rounded-xl
                            border border-border/50
                            bg-background/75
                            backdrop-blur-2xl
                            shadow-[0_8px_30px_rgb(0,0,0,0.08)]
                        "
                >
                    {/* Brand */}
                    <Link
                        to="/"
                        className="flex items-center gap-2.5 group"
                    >
                        <img
                            src={logo}
                            alt="DevFlow logo"
                            className="size-8 object-contain transition-transform duration-200 group-hover:scale-105"
                        />

                        <span className="text-[15px] font-semibold tracking-tight text-slate-100 flex items-baseline gap-[1px]">
                            Dev<span className="font-mono text-[13px] font-medium text-[oklch(0.72_0.20_290)]">FLOW</span>
                        </span>
                    </Link>

                    {/* Navigation */}
                    <nav
                        className="
                                hidden md:flex
                                items-center
                                gap-1
                                absolute left-1/2 -translate-x-1/2
                            "
                    >
                        <a
                            href="#features"
                            onClick={(e) => onSmoothScroll(e, '#features')}
                            className="
                                    px-3 py-1.5
                                    rounded-md
                                    text-[13px]
                                    text-muted-foreground
                                    hover:text-foreground
                                    hover:bg-muted/60
                                    transition-all
                                    cursor-pointer
                                "
                        >
                            Features
                        </a>

                        <a
                            href="#workflow"
                            onClick={(e) => onSmoothScroll(e, '#workflow')}
                            className="
                                    px-3 py-1.5
                                    rounded-md
                                    text-[13px]
                                    text-muted-foreground
                                    hover:text-foreground
                                    hover:bg-muted/60
                                    transition-all
                                    cursor-pointer
                                "
                        >
                            Workflow
                        </a>

                        <a
                            href="#pricing"
                            onClick={(e) => onSmoothScroll(e, '#pricing')}
                            className="
                                    px-3 py-1.5
                                    rounded-md
                                    text-[13px]
                                    text-muted-foreground
                                    hover:text-foreground
                                    hover:bg-muted/60
                                    transition-all
                                    cursor-pointer
                                "
                        >
                            Pricing
                        </a>
                    </nav>

                    {/* Actions */}
                    <div className="flex items-center gap-1.5">
                        <Link
                            to="/login"
                            className="
                                    hidden sm:inline-flex
                                    h-9 px-3.5
                                    items-center
                                    text-[13px]
                                    font-medium
                                    text-muted-foreground
                                    hover:text-foreground
                                    rounded-lg
                                    transition-colors
                                "
                        >
                            Sign in
                        </Link>

                        <Link
                            to="/signup"
                            className="
                                    group
                                    h-9
                                    px-4
                                    inline-flex
                                    items-center
                                    gap-2
                                    rounded-lg
                                    bg-primary
                                    text-primary-foreground
                                    text-[13px]
                                    font-medium
                                    shadow-sm
                                    hover:shadow-md
                                    hover:bg-primary/90
                                    transition-all
                                "
                        >
                            Get started

                            <ArrowRight
                                className="
                                        size-3.5
                                        transition-transform duration-200
                                        group-hover:translate-x-0.5
                                    "
                            />
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
}

/* ---------------- REST OF THE COMPONENTS REMAIN UNCHANGED ---------------- */

/* ---------------- HERO ---------------- */

/* ---------------- HERO ---------------- */

function Hero() {
    return (
        <section className="relative isolate min-h-screen pt-28 pb-20 px-4 sm:px-6 overflow-hidden">
            {/* ───────────────── BACKGROUND ───────────────── */}
            <div className="landing-background-fade absolute inset-0 z-0 overflow-hidden">
                {/* Static drafting grid */}
                <div
                    className="absolute inset-0 opacity-[0.035]"
                    style={{
                        backgroundImage: `
                            linear-gradient(oklch(1 0 0 / 1) 1px, transparent 1px),
                            linear-gradient(90deg, oklch(1 0 0 / 1) 1px, transparent 1px)
                        `,
                        backgroundSize: "40px 40px",
                    }}
                />

                <LandingBackground />

                {/* Central atmospheric glow */}
                <div
                    className="
                        absolute
                        left-1/2
                        top-[38%]
                        -translate-x-1/2
                        -translate-y-1/2
                        w-[700px]
                        h-[500px]
                        rounded-full
                        bg-primary/[0.045]
                        blur-[120px]
                        pointer-events-none
                    "
                />
            </div>

            {/* ───────────────── REGISTRATION MARKS ───────────────── */}
            {[
                "top-4 left-4 border-t border-l",
                "top-4 right-4 border-t border-r",
                "bottom-4 left-4 border-b border-l",
                "bottom-4 right-4 border-b border-r",
            ].map((pos) => (
                <div
                    key={pos}
                    className={`
                        absolute
                        ${pos}
                        size-3
                        border-primary/30
                        z-10
                        pointer-events-none
                    `}
                />
            ))}

            {/* ───────────────── HERO COPY ───────────────── */}
            <div className="relative z-10 max-w-4xl mx-auto text-center">
                {/* Figure label */}
                <div className="inline-flex items-center gap-3 mb-8">
                    <span className="w-6 h-px bg-border" />

                    <span className="
                        text-[9px]
                        font-mono
                        tracking-[0.2em]
                        text-muted-foreground/60
                        uppercase
                    ">
                        Fig. 01 — Surface
                    </span>

                    <span className="w-6 h-px bg-border" />
                </div>

                {/* Headline */}
                <h1 className="
                    text-[2.8rem]
                    sm:text-[3.4rem]
                    md:text-[4.25rem]
                    lg:text-[4.7rem]
                    font-semibold
                    tracking-[-0.055em]
                    leading-[0.98]
                    text-balance
                    max-w-4xl
                    mx-auto
                ">
                    Your team's work,
                    <br />

                    <span className="
                        text-transparent
                        bg-clip-text
                        bg-gradient-to-r
                        from-primary
                        via-primary
                        to-primary/60
                    ">
                        on one surface.
                    </span>
                </h1>

                {/* Supporting copy */}
                <p className="
                    mt-7
                    max-w-xl
                    mx-auto
                    text-[14px]
                    sm:text-[15px]
                    leading-relaxed
                    text-muted-foreground
                    text-balance
                ">
                    A project workspace built like a drafting surface —
                    focused, spatial, and always in motion.
                    Plan, discuss, and execute without the dashboard noise.
                </p>

                {/* ───────────────── CTA ───────────────── */}
                <div className="
                    mt-9
                    flex
                    flex-col
                    sm:flex-row
                    items-center
                    justify-center
                    gap-2.5
                ">
                    {/* Primary */}
                    <div className="relative group">
                        <div className="
                            absolute
                            -inset-1
                            rounded-lg
                            bg-primary/25
                            blur-md
                            opacity-60
                            group-hover:opacity-100
                            transition-opacity
                            duration-500
                        " />

                        <Link
                            to="/signup"
                            className="
                                relative
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
                            Start a workspace

                            <ArrowRight
                                className="
                                    size-3.5
                                    opacity-80
                                    transition-transform
                                    duration-200
                                    group-hover:translate-x-0.5
                                "
                            />
                        </Link>
                    </div>

                    {/* Secondary */}
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
                            hover:bg-surface-elevated
                            hover:border-border
                            transition-colors
                        "
                    >
                        Explore the system
                    </Link>
                </div>

                {/* ───────────────── TECHNICAL META ───────────────── */}
                <div className="
                    mt-8
                    flex
                    flex-wrap
                    items-center
                    justify-center
                    gap-x-4
                    gap-y-2
                    text-[8px]
                    sm:text-[9px]
                    font-mono
                    tracking-[0.14em]
                    text-muted-foreground/60
                    uppercase
                ">
                    <span>WORKSPACE / LIVE</span>

                    <span className="w-px h-3 bg-border/70" />

                    <span>SYNC / &lt;100ms</span>

                    <span className="w-px h-3 bg-border/70" />

                    <span>SEATS / 01—10</span>

                    <span className="w-px h-3 bg-border/70" />

                    <span className="text-primary/60">
                        STATUS / READY
                    </span>
                </div>
            </div>

            {/* ───────────────── SCALE INDICATOR ───────────────── */}
            <div className="
                relative
                z-10
                max-w-6xl
                mx-auto
                mt-14
                flex
                flex-col
                items-center
                gap-2
            ">
                <div className="flex items-end gap-[3px] h-3">
                    {Array.from({ length: 25 }).map((_, i) => (
                        <span
                            key={i}
                            className={`
                                w-px
                                ${i % 5 === 0
                                    ? "h-3 bg-border"
                                    : i % 2 === 0
                                        ? "h-2 bg-border/70"
                                        : "h-1 bg-border/50"
                                }
                            `}
                        />
                    ))}
                </div>

                <div className="
                    flex
                    items-center
                    justify-between
                    w-[210px]
                    text-[7px]
                    font-mono
                    tracking-[0.12em]
                    text-muted-foreground/60
                ">
                    <span>0</span>
                    <span>10</span>
                    <span>20</span>
                    <span>30</span>
                    <span>40</span>
                </div>
            </div>

            {/* ───────────────── PRODUCT PREVIEW ───────────────── */}
            <div className="
                relative
                z-10
                max-w-6xl
                mx-auto
                mt-12
                sm:mt-14
            ">
                {/* Ambient product glow */}
                <div className="
                    absolute
                    left-1/2
                    top-1/2
                    -translate-x-1/2
                    -translate-y-1/2
                    w-[75%]
                    h-[65%]
                    rounded-full
                    bg-primary/[0.08]
                    blur-[100px]
                    pointer-events-none
                    -z-10
                " />

                {/* Technical header */}
                <div className="
                    flex
                    items-center
                    justify-between
                    mb-2.5
                    px-1
                ">
                    <div className="
                        flex
                        items-center
                        gap-2
                        text-[8px]
                        sm:text-[9px]
                        font-mono
                        tracking-[0.14em]
                        text-muted-foreground/60
                        uppercase
                    ">
                        <span>Fig. 02</span>
                        <span className="w-3 h-px bg-border" />
                        <span>Workspace View</span>
                    </div>

                    <span className="
                        text-[8px]
                        sm:text-[9px]
                        font-mono
                        tracking-[0.1em]
                        text-muted-foreground/60
                    ">
                        REV / 01
                    </span>
                </div>

                {/* Preview frame */}
                <div className="
                    relative
                    p-[3px]
                    border
                    border-border/60
                    bg-surface/30
                    shadow-2xl
                    shadow-black/60
                ">
                    {/* Corner registration marks */}
                    <div className="
                        absolute
                        -top-1
                        -left-1
                        size-3
                        border-t
                        border-l
                        border-primary/50
                        z-20
                        pointer-events-none
                    " />

                    <div className="
                        absolute
                        -top-1
                        -right-1
                        size-3
                        border-t
                        border-r
                        border-primary/50
                        z-20
                        pointer-events-none
                    " />

                    <div className="
                        absolute
                        -bottom-1
                        -left-1
                        size-3
                        border-b
                        border-l
                        border-primary/50
                        z-20
                        pointer-events-none
                    " />

                    <div className="
                        absolute
                        -bottom-1
                        -right-1
                        size-3
                        border-b
                        border-r
                        border-primary/50
                        z-20
                        pointer-events-none
                    " />

                    <div className="
                        border
                        border-border/40
                        bg-background
                        overflow-hidden
                    ">
                        <ProductPreview />
                    </div>
                </div>

                {/* Bottom technical annotation */}
                <div className="
                    mt-2.5
                    flex
                    items-center
                    justify-between
                    px-1
                    text-[7px]
                    sm:text-[8px]
                    font-mono
                    tracking-[0.12em]
                    text-muted-foreground/60
                    uppercase
                ">
                    <span>DEVFLOW / CORE SURFACE</span>
                    <span>Scale 1:1</span>
                    <span>System / Operational</span>
                </div>
            </div>
        </section>
    );
}

function ProductPreview() {
    const [activeCol, setActiveCol] = useState(1);

    useEffect(() => {
        const id = setInterval(() => setActiveCol((c) => (c + 1) % 4), 3800);
        return () => clearInterval(id);
    }, []);

    const cols = [
        { name: "Backlog", dot: "bg-status-todo", count: 5 },
        { name: "In Progress", dot: "bg-status-progress", count: 3 },
        { name: "Review", dot: "bg-status-review", count: 2 },
        { name: "Done", dot: "bg-status-done", count: 9 },
    ];

    return (
        <div className="bg-card">
            {/* Title block — drafting metadata */}
            <div className="h-8 border-b border-border bg-sidebar/80 flex items-center px-3.5 gap-3 font-mono text-[9.5px] tracking-wide text-muted-foreground">
                <span className="text-foreground/60">PROJECT</span>
                <span className="text-foreground/80">AURORA MOBILE</span>
                <span className="w-px h-2.5 bg-border" />
                <span>SCALE 1:1</span>
                <span className="w-px h-2.5 bg-border" />
                <span>REV A</span>
                <span className="ml-auto text-foreground/50">devflow.app / aurora-mobile</span>
            </div>

            {/* Board */}
            <div className="grid grid-cols-4 gap-px bg-border/80">
                {cols.map((c, i) => (
                    <div key={c.name} className="min-w-0 bg-background p-3.5">
                        <div className="flex items-center gap-1.5 mb-2.5 px-0.5">
                            <span className={`size-1.5 rounded-full ${c.dot}`} />
                            <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-foreground/85">
                                {c.name}
                            </span>
                            <span className="text-[9px] text-muted-foreground ml-auto font-mono tabular-nums">
                                {c.count}
                            </span>
                        </div>

                        <div className="space-y-1.5">
                            {[0, 1, 2].map((j) => (
                                <MiniCard
                                    key={j}
                                    variant={(i + j) % 4}
                                    live={i === activeCol && j === 0}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function MiniCard({ variant, live }: { variant: number; live?: boolean }) {
    const titles = [
        "Refactor OAuth flow for mobile",
        "Add keyboard shortcuts",
        "Migrate notifications schema",
        "Fix race in presence indicator",
    ];

    const priColors = [
        "bg-priority-urgent",
        "bg-priority-high",
        "bg-priority-medium",
        "bg-priority-low",
    ];

    const avatars = [
        "from-rose-400 to-pink-600",
        "from-amber-400 to-orange-600",
        "from-emerald-400 to-teal-600",
        "from-sky-400 to-indigo-600",
    ];

    return (
        <div
            className={`
            rounded border bg-card p-2 transition-colors cursor-default
            ${live
                    ? "border-primary/50 bg-primary/[0.03]"
                    : "border-border/70 hover:border-border"
                }
        `}
        >
            <div className="flex items-center gap-1.5 mb-1">
                <span className={`size-1 rounded-[1px] ${priColors[variant]}`} />
                <span className="text-[8.5px] font-mono text-muted-foreground/60 tracking-wide">
                    DEV-{214 + variant * 11}
                </span>

                {live && (
                    <span className="ml-auto flex items-center gap-1 text-[8.5px] text-primary font-medium tracking-wide">
                        <span className="size-1 rounded-full bg-primary animate-pulse" />
                        LIVE
                    </span>
                )}
            </div>

            <div className="text-[10.5px] leading-snug text-foreground/85 line-clamp-2">
                {titles[variant]}
            </div>

            <div className="flex items-center justify-between mt-1.5">
                <div className="flex -space-x-1">
                    <div
                        className={`size-3.5 rounded-full bg-gradient-to-br ${avatars[variant]} ring-1 ring-card`}
                    />
                    {variant % 2 === 0 && (
                        <div
                            className={`size-3.5 rounded-full bg-gradient-to-br ${avatars[(variant + 2) % 4]} ring-1 ring-card`}
                        />
                    )}
                </div>
                <span className="text-[8.5px] text-muted-foreground/60 font-mono">
                    Apr {18 + variant}
                </span>
            </div>
        </div>
    );
}

/* ---------------- LOGOS ---------------- */

function LogoStrip() {
    // We pair each name with a Lucide icon to simulate a real company logo
    const teams = [
        { name: "Northwind", icon: Hexagon },
        { name: "Fieldstone", icon: Triangle },
        { name: "Aperture", icon: Command },
        { name: "Redline", icon: Activity },
        { name: "Basecamp Labs", icon: Box },
        { name: "Trestle", icon: Cloud },
    ];

    return (
        <section className="relative py-10 border-y border-border/60 bg-sidebar/30 overflow-hidden">
            {/* Subtle continuation of the drafting grid */}
            <div
                className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{
                    backgroundImage: `
                linear-gradient(oklch(1 0 0 / 1) 1px, transparent 1px),
                linear-gradient(90deg, oklch(1 0 0 / 1) 1px, transparent 1px)
            `,
                    backgroundSize: "40px 40px",
                }}
            />

            <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
                {/* Annotation label */}
                <div className="flex items-center justify-center gap-3 mb-8">
                    <span className="w-5 h-px bg-border" />
                    <span className="text-[10px] font-mono tracking-[0.16em] text-muted-foreground/60 uppercase">
                        Ref. Teams
                    </span>
                    <span className="w-5 h-px bg-border" />
                </div>

                {/* Edge-fading mask wrapper */}
                <div
                    className="relative w-full"
                    style={{
                        WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
                        maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)'
                    }}
                >
                    {/* Names + Fake Logos */}
                    <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 px-10">
                        {teams.map((team) => (
                            <div
                                key={team.name}
                                className="flex items-center gap-2.5 text-foreground/40 hover:text-foreground/85 transition-colors duration-300 cursor-default grayscale hover:grayscale-0"
                            >
                                <team.icon className="size-[18px]" strokeWidth={2} />
                                <span className="text-[14px] font-semibold tracking-tight">
                                    {team.name}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

/* ---------------- FEATURES ---------------- */

function Features() {
    const features = [
        {
            icon: Zap,
            index: "01",
            title: "Real-time everything",
            desc: "Cards move, comments stream, and presence updates instantly. Everyone stays on the same state without refreshing.",
            metric: "< 100ms",
            metricLabel: "SYNC LATENCY",
            visual: "pulse",
        },
        {
            icon: Layers,
            index: "02",
            title: "Kanban that scales",
            desc: "Drag, drop, filter, and group issues without the board becoming another source of friction.",
            metric: "10K+",
            metricLabel: "ISSUES / BOARD",
            visual: "bars",
        },
        {
            icon: Lock,
            index: "03",
            title: "Role-based access",
            desc: "Admins, members, and viewers get precisely the access they need — nothing more.",
            metric: "RBAC",
            metricLabel: "ACCESS MODEL",
            visual: "lock",
        },
        {
            icon: Bell,
            index: "04",
            title: "Smart notifications",
            desc: "Surface what matters, mute what doesn't, and keep your attention where the work is.",
            metric: "24/7",
            metricLabel: "SIGNAL",
            visual: "signal",
        },
        {
            icon: Users,
            index: "05",
            title: "Workspaces that fit",
            desc: "Organize teams, projects, invites, and permissions without forcing everyone into one structure.",
            metric: "N",
            metricLabel: "WORKSPACES",
            visual: "nodes",
        },
    ];

    return (
        <section
            id="features"
            className="relative py-28 px-4 sm:px-6 overflow-hidden"
        >

            <div className="relative max-w-6xl mx-auto">

                {/* Header */}
                <div className="max-w-2xl mb-14">
                    <div className="inline-flex items-center gap-3 mb-5 text-[10px] font-mono tracking-[0.16em] text-muted-foreground/60 uppercase">
                        <span className="w-5 h-px bg-border" />
                        Fig. 03 — Instruments
                        <span className="w-5 h-px bg-border" />
                    </div>

                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                        <div>
                            <h2 className="text-3xl md:text-[2.5rem] font-semibold tracking-[-0.035em] leading-[1.05]">
                                Everything your team needs.
                                <br />
                                <span className="text-muted-foreground/60">
                                    Nothing it doesn't.
                                </span>
                            </h2>
                        </div>

                        <p className="max-w-xs text-[13px] leading-relaxed text-muted-foreground">
                            Six focused systems designed to keep planning,
                            communication, and execution on the same surface.
                        </p>
                    </div>
                </div>

                {/* Feature system */}
                <div className="border border-border bg-background/70">

                    {/* Top technical bar */}
                    <div className="h-9 px-4 border-b border-border bg-sidebar/50 flex items-center justify-between font-mono text-[9px] tracking-[0.12em] text-muted-foreground/60">
                        <span>DEVFLOW / CORE SYSTEMS</span>

                        <div className="flex items-center gap-3">
                            <span>6 MODULES</span>
                            <span className="w-px h-3 bg-border" />
                            <span>REV. 01</span>
                        </div>
                    </div>

                    {/* Features */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
                        {features.map((feature, index) => {
                            const Icon = feature.icon;

                            return (
                                <div
                                    key={feature.title}
                                    className={`
                                        group relative min-h-[245px]
                                        bg-background
                                        p-6
                                        overflow-hidden
                                        transition-colors duration-300
                                        hover:bg-surface/40
                                        ${index === 0 ? "lg:col-span-2" : ""}
                                    `}
                                >
                                    {/* Hover glow */}
                                    <div
                                        className="
                                            absolute -top-20 -right-20
                                            size-40 rounded-full
                                            bg-primary/10 blur-3xl
                                            opacity-0
                                            group-hover:opacity-100
                                            transition-opacity duration-500
                                            pointer-events-none
                                        "
                                    />

                                    {/* Module number */}
                                    <div className="flex items-center justify-between mb-8">
                                        <span className="text-[9px] font-mono tracking-[0.16em] text-muted-foreground/60">
                                            MOD / {feature.index}
                                        </span>

                                        <div
                                            className="
                                                size-8
                                                border border-border
                                                flex items-center justify-center
                                                text-muted-foreground/60
                                                group-hover:border-primary/40
                                                group-hover:text-primary
                                                transition-colors
                                            "
                                        >
                                            <Icon
                                                className="size-3.5"
                                                strokeWidth={1.8}
                                            />
                                        </div>
                                    </div>

                                    {/* Main content */}
                                    <div className="relative z-10">
                                        <h3 className="text-[15px] font-semibold tracking-tight mb-2">
                                            {feature.title}
                                        </h3>

                                        <p className="text-[12.5px] text-muted-foreground leading-relaxed max-w-sm">
                                            {feature.desc}
                                        </p>
                                    </div>

                                    {/* Technical metric */}
                                    <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                                        <div>
                                            <div className="text-[15px] font-mono tracking-tight text-foreground/80">
                                                {feature.metric}
                                            </div>

                                            <div className="mt-0.5 text-[8px] font-mono tracking-[0.14em] text-muted-foreground/60">
                                                {feature.metricLabel}
                                            </div>
                                        </div>

                                        {/* Visual instrument */}
                                        <FeatureVisual type={feature.visual} />
                                    </div>

                                    {/* Corner registration mark */}
                                    <div
                                        className="
                                            absolute bottom-0 right-0
                                            size-3
                                            border-b border-r
                                            border-primary/0
                                            group-hover:border-primary/30
                                            transition-colors
                                        "
                                    />
                                </div>
                            );
                        })}
                    </div>

                    {/* Bottom technical bar */}
                    <div className="h-8 px-4 border-t border-border bg-sidebar/30 flex items-center justify-between">
                        <span className="text-[8px] font-mono tracking-[0.14em] text-muted-foreground/60">
                            SYSTEM STATUS
                        </span>

                        <div className="flex items-center gap-1.5">
                            <span className="size-1.5 rounded-full bg-primary animate-pulse" />
                            <span className="text-[8px] font-mono tracking-[0.12em] text-primary/70">
                                ALL SYSTEMS OPERATIONAL
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function FeatureVisual({ type }: { type: string }) {
    if (type === "pulse") {
        return (
            <div className="flex items-center gap-[3px] h-8">
                {[4, 7, 12, 18, 10, 6, 14, 8, 4].map((height, i) => (
                    <span
                        key={i}
                        className="w-px bg-primary/40 group-hover:bg-primary/70 transition-colors"
                        style={{ height: `${height}px` }}
                    />
                ))}
            </div>
        );
    }

    if (type === "bars") {
        return (
            <div className="flex items-end gap-1 h-8">
                {[8, 14, 20, 12, 25, 17].map((height, i) => (
                    <span
                        key={i}
                        className="w-1 bg-border group-hover:bg-primary/50 transition-colors"
                        style={{ height: `${height}px` }}
                    />
                ))}
            </div>
        );
    }

    if (type === "thread") {
        return (
            <div className="flex flex-col gap-1.5 w-16">
                <span className="h-px bg-border group-hover:bg-primary/50 transition-colors" />
                <span className="h-px w-10 ml-3 bg-border group-hover:bg-primary/40 transition-colors" />
                <span className="h-px w-7 ml-6 bg-border group-hover:bg-primary/30 transition-colors" />
            </div>
        );
    }

    if (type === "lock") {
        return (
            <div className="relative size-7 border border-border group-hover:border-primary/40 transition-colors">
                <div className="absolute left-1/2 top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 border border-muted-foreground/50 group-hover:border-primary transition-colors" />
                <div className="absolute left-1/2 -top-1.5 -translate-x-1/2 size-3 border border-b-0 border-border group-hover:border-primary/40 transition-colors rounded-t-full" />
            </div>
        );
    }

    if (type === "signal") {
        return (
            <div className="flex items-end gap-1 h-8">
                {[5, 9, 14, 20].map((height, i) => (
                    <span
                        key={i}
                        className="w-1 border border-border group-hover:border-primary/50 transition-colors"
                        style={{ height: `${height}px` }}
                    />
                ))}
            </div>
        );
    }

    return (
        <div className="relative size-12">
            <span className="absolute top-0 left-1/2 size-2 -translate-x-1/2 rounded-full border border-border group-hover:border-primary/50" />
            <span className="absolute bottom-0 left-0 size-2 rounded-full border border-border group-hover:border-primary/50" />
            <span className="absolute bottom-0 right-0 size-2 rounded-full border border-border group-hover:border-primary/50" />

            <span className="absolute top-2 left-1/2 w-px h-5 bg-border group-hover:bg-primary/30" />
            <span className="absolute bottom-2 left-2 w-8 h-px bg-border group-hover:bg-primary/30" />
        </div>
    );
}

/* ---------------- BOARD SHOWCASE ---------------- */

function BoardShowcase() {
    const events = [
        {
            name: "Sarah",
            initials: "SK",
            action: "moved",
            ref: "DEV-241",
            target: "In Review",
            time: "just now",
            type: "MOVE",
            live: true,
        },
        {
            name: "Marcus",
            initials: "MJ",
            action: "commented on",
            ref: "DEV-219",
            time: "2s ago",
            type: "COMMENT",
        },
        {
            name: "Priya",
            initials: "PS",
            action: "pushed a fix on",
            ref: "DEV-198",
            time: "2m ago",
            type: "PUSH",
        },
        {
            name: "Alex",
            initials: "AR",
            action: "assigned",
            ref: "DEV-227",
            target: "Marcus",
            time: "4m ago",
            type: "ASSIGN",
        },
    ];

    return (
        <section className="relative py-28 px-4 sm:px-6 border-t border-border bg-sidebar/25 overflow-hidden">

            {/* ── Ambient signal field ── */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">

                {/* Horizontal data lines */}
                <div className="absolute inset-0 opacity-[0.025]">
                    {[18, 36, 54, 72, 88].map((top) => (
                        <div
                            key={top}
                            className="absolute left-0 right-0 h-px bg-primary"
                            style={{ top: `${top}%` }}
                        />
                    ))}
                </div>

                {/* Moving signals */}
                <div
                    className="
                        absolute top-[25%] left-0
                        w-32 h-px
                        bg-gradient-to-r from-transparent via-primary/40 to-transparent
                        animate-[activity-signal_7s_linear_infinite]
                    "
                />

                <div
                    className="
                        absolute top-[68%] left-0
                        w-20 h-px
                        bg-gradient-to-r from-transparent via-primary/30 to-transparent
                        animate-[activity-signal_11s_linear_infinite]
                    "
                    style={{ animationDelay: "-4s" }}
                />

                {/* Radial atmosphere */}
                <div
                    className="
                        absolute
                        left-[65%] top-1/2
                        -translate-x-1/2 -translate-y-1/2
                        size-[500px]
                        rounded-full
                        bg-primary/[0.035]
                        blur-[100px]
                    "
                />
            </div>

            <div className="relative max-w-5xl mx-auto grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">

                {/* ───────────────── COPY ───────────────── */}
                <div>
                    <div className="inline-flex items-center gap-3 mb-5 text-[10px] font-mono tracking-[0.16em] text-muted-foreground/60 uppercase">
                        <span className="w-5 h-px bg-border" />
                        Fig. 04 — Activity
                        <span className="w-5 h-px bg-border" />
                    </div>

                    <h2 className="text-3xl md:text-[2.5rem] font-semibold tracking-[-0.035em] leading-[1.05]">
                        The work is always
                        <br />
                        <span className="text-muted-foreground/55">
                            in motion.
                        </span>
                    </h2>

                    <p className="text-[15px] text-muted-foreground mt-5 leading-relaxed max-w-md">
                        Every move, comment, assignment, and deployment becomes
                        part of a shared live stream. Your team sees the same
                        system state, at the same time.
                    </p>

                    <ul className="mt-8 space-y-3">
                        {[
                            "Sub-100ms updates over WebSockets",
                            "Live presence and activity signals",
                            "Optimistic updates with conflict resolution",
                            "Complete project activity history",
                        ].map((item) => (
                            <li
                                key={item}
                                className="flex items-center gap-2.5 text-[13px]"
                            >
                                <span className="size-4 border border-border flex items-center justify-center shrink-0">
                                    <Check
                                        className="size-2.5 text-primary"
                                        strokeWidth={2.5}
                                    />
                                </span>

                                <span className="text-foreground/80">
                                    {item}
                                </span>
                            </li>
                        ))}
                    </ul>

                    {/* Technical metadata */}
                    <div className="mt-9 flex items-center gap-5 text-[9px] font-mono tracking-[0.12em] text-muted-foreground/40">
                        <span>PROTOCOL / WS</span>
                        <span className="w-px h-3 bg-border" />
                        <span>SYNC / LIVE</span>
                        <span className="w-px h-3 bg-border" />
                        <span>STATUS / OK</span>
                    </div>
                </div>

                {/* ───────────────── ACTIVITY PANEL ───────────────── */}
                <div className="relative">

                    {/* Outer glow */}
                    <div className="absolute -inset-8 bg-primary/[0.035] blur-[60px] pointer-events-none" />

                    <div className="relative border border-border bg-card/95 overflow-hidden shadow-2xl shadow-black/20">

                        {/* Header */}
                        <div className="h-9 border-b border-border bg-sidebar/80 px-3.5 flex items-center justify-between">

                            <div className="flex items-center gap-3 font-mono text-[9px] tracking-[0.1em]">
                                <span className="text-foreground/55">
                                    LOG
                                </span>

                                <span className="text-foreground/80">
                                    ACTIVITY STREAM
                                </span>

                                <span className="w-px h-3 bg-border" />

                                <span className="text-muted-foreground/50">
                                    WS://LIVE
                                </span>
                            </div>

                            <div className="flex items-center gap-1.5 text-primary">
                                <span className="relative flex size-1.5">
                                    <span className="absolute inline-flex size-full rounded-full bg-primary opacity-50 animate-ping" />
                                    <span className="relative inline-flex size-1.5 rounded-full bg-primary" />
                                </span>

                                <span className="text-[8px] font-mono tracking-[0.12em]">
                                    CONNECTED
                                </span>
                            </div>
                        </div>

                        {/* Stream metadata */}
                        <div className="h-8 border-b border-border/70 px-3.5 flex items-center justify-between bg-background/40">
                            <span className="text-[8px] font-mono tracking-[0.12em] text-muted-foreground/40">
                                PROJECT / AURORA-MOBILE
                            </span>

                            <span className="text-[8px] font-mono text-muted-foreground/40">
                                EVENTS / 1,284
                            </span>
                        </div>

                        {/* Event stream */}
                        <div className="relative">

                            {/* Timeline spine */}
                            <div className="absolute left-[29px] top-5 bottom-5 w-px bg-border/70" />

                            {events.map((event, index) => (
                                <ActivityEvent
                                    key={event.ref}
                                    event={event}
                                    index={index}
                                />
                            ))}

                            {/* Nested thread */}
                            <div className="relative px-4 py-4 border-t border-border/70">

                                <div className="ml-7 pl-4 border-l border-border/70">

                                    <div className="flex items-start gap-2.5">

                                        <div className="size-6 flex items-center justify-center border border-border bg-background text-[8px] font-mono text-muted-foreground shrink-0">
                                            PS
                                        </div>

                                        <div className="min-w-0">
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-[11px] font-medium">
                                                    Priya
                                                </span>

                                                <span className="text-[9px] font-mono text-muted-foreground/50">
                                                    2m
                                                </span>
                                            </div>

                                            <p className="text-[11px] text-foreground/75 mt-0.5 leading-relaxed">
                                                Token refresh edge case fixed.
                                                Ready for review.
                                            </p>
                                        </div>

                                    </div>

                                    <div className="flex items-start gap-2.5 mt-3 ml-7">

                                        <div className="size-5 flex items-center justify-center border border-border bg-background text-[8px] font-mono text-muted-foreground shrink-0">
                                            AR
                                        </div>

                                        <div>
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-[10.5px] font-medium">
                                                    Alex
                                                </span>

                                                <span className="text-[9px] font-mono text-muted-foreground/50">
                                                    just now
                                                </span>
                                            </div>

                                            <p className="text-[11px] text-foreground/65 mt-0.5">
                                                LGTM, merging now.
                                            </p>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="h-9 border-t border-border bg-sidebar/50 px-3.5 flex items-center justify-between">

                            <div className="flex items-center gap-2">
                                <span className="text-[8px] font-mono text-muted-foreground/40 tracking-[0.1em]">
                                    STREAM
                                </span>

                                <span className="text-[8px] font-mono text-primary/70">
                                    ACTIVE
                                </span>
                            </div>

                            <span className="text-[8px] font-mono text-muted-foreground/40">
                                LAST EVENT 0.08s AGO
                            </span>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
}

function ActivityEvent({
    event,
}: {
    event: {
        name: string;
        initials: string;
        action: string;
        ref: string;
        target?: string;
        time: string;
        type: string;
        live?: boolean;
    };
    index: number;
}) {
    return (
        <div
            className={`
                group relative
                px-4 py-3.5
                flex items-center gap-3
                border-b border-border/70
                transition-colors
                hover:bg-surface/40
                ${event.live ? "bg-primary/[0.025]" : ""}
            `}
        >
            {/* Timeline node */}
            <div
                className={`
                    relative z-10
                    size-2
                    rounded-full
                    border
                    shrink-0
                    ${event.live
                        ? "border-primary bg-primary shadow-[0_0_10px_oklch(0.72_0.18_280/0.55)]"
                        : "border-border bg-background group-hover:border-primary/50"
                    }
                    transition-colors
                `}
            />

            {/* Event content */}
            <div className="flex-1 min-w-0">

                <div className="flex items-center gap-2">
                    <span className="text-[8px] font-mono tracking-[0.1em] text-muted-foreground/40">
                        {event.type}
                    </span>

                    <span className="text-[8px] font-mono text-muted-foreground/35">
                        {event.time}
                    </span>
                </div>

                <p className="text-[11.5px] leading-snug mt-1">
                    <span className="font-medium text-foreground/90">
                        {event.name}
                    </span>{" "}
                    <span className="text-foreground/65">
                        {event.action}
                    </span>{" "}
                    <span className="font-mono text-muted-foreground">
                        {event.ref}
                    </span>

                    {event.target && (
                        <>
                            {" "}
                            <span className="text-muted-foreground/50">
                                →
                            </span>{" "}
                            <span className="text-status-review font-medium">
                                {event.target}
                            </span>
                        </>
                    )}
                </p>
            </div>

            {/* Avatar */}
            <div className="size-6 flex items-center justify-center border border-border bg-background text-[8px] font-mono text-muted-foreground shrink-0">
                {event.initials}
            </div>

            {event.live && (
                <span className="hidden sm:block text-[8px] font-mono text-primary tracking-[0.1em]">
                    LIVE
                </span>
            )}
        </div>
    );
}

/* ---------------- WORKFLOW ---------------- */

function Workflow() {
    const steps = [
        {
            n: "01",
            phase: "INITIALIZE",
            title: "Create your workspace",
            desc: "Sign up in seconds. Invite your team by email or share a link.",
            meta: "WORKSPACE / READY",
        },
        {
            n: "02",
            phase: "CONFIGURE",
            title: "Spin up a project",
            desc: "Pick a template or start blank. Configure columns to match your flow.",
            meta: "PROJECT / CONFIGURED",
        },
        {
            n: "03",
            phase: "EXECUTE",
            title: "Track, discuss, ship",
            desc: "Drag issues across the board. Comment in threads. Watch your team move in real time.",
            meta: "SYSTEM / OPERATIONAL",
        },
    ];

    return (
        <section
            id="workflow"
            className="relative py-28 px-4 sm:px-6 border-t boorder-border overflow-hidden"
        >
            {/* Subtle drafting atmosphere */}
            <div
                className="
                    pointer-events-none
                    absolute
                    inset-x-0
                    top-1/2
                    -translate-y-1/2
                    h-px
                    bg-gradient-to-r
                    from-transparent
                    via-border
                    to-transparent
                    opacity-50
                "
            />

            <div className="max-w-6xl mx-auto relative">
                {/* ───────────── HEADER ───────────── */}
                <div className="max-w-2xl mb-16">
                    <div className="
                        inline-flex
                        items-center
                        gap-3
                        mb-6
                        text-[9px]
                        font-mono
                        tracking-[0.2em]
                        text-muted-foreground/60
                        uppercase
                    ">
                        <span className="w-6 h-px bg-border" />
                        Fig. 05 — Sequence
                    </div>

                    <h2 className="
                        text-3xl
                        sm:text-4xl
                        md:text-[2.8rem]
                        font-semibold
                        tracking-[-0.045em]
                        leading-[1.05]
                    ">
                        From first workspace
                        <br />
                        <span className="text-muted-foreground/50">
                            to shipping.
                        </span>
                    </h2>

                    <p className="
                        mt-5
                        max-w-lg
                        text-[13px]
                        sm:text-[14px]
                        leading-relaxed
                        text-muted-foreground
                    ">
                        A simple flow designed to get your team working
                        without spending an afternoon configuring a tracker.
                    </p>
                </div>

                {/* ───────────── PROCESS ───────────── */}
                <div className="
                    relative
                    grid
                    md:grid-cols-3
                    border
                    border-border
                    bg-border
                    gap-px
                ">
                    {/* Connecting process line */}
                    <div className="
                        hidden
                        md:block
                        absolute
                        left-[12%]
                        right-[12%]
                        top-[52px]
                        h-px
                        bg-border
                        z-20
                        pointer-events-none
                    " />

                    {steps.map((step, index) => (
                        <div
                            key={step.n}
                            className="
                                group
                                relative
                                min-h-[280px]
                                bg-background
                                p-6
                                sm:p-7
                                overflow-hidden
                                transition-colors
                                duration-300
                                hover:bg-surface/40
                            "
                        >
                            {/* Hover atmosphere */}
                            <div className="
                                absolute
                                -top-24
                                -right-24
                                size-48
                                rounded-full
                                bg-primary/10
                                blur-3xl
                                opacity-0
                                group-hover:opacity-100
                                transition-opacity
                                duration-500
                                pointer-events-none
                            " />

                            {/* Step number / node */}
                            <div className="
                                relative
                                z-10
                                flex
                                items-center
                                justify-between
                            ">
                                <div className="
                                    size-10
                                    border
                                    border-border
                                    bg-card
                                    flex
                                    items-center
                                    justify-center
                                    font-mono
                                    text-[10px]
                                    text-muted-foreground
                                    group-hover:border-primary/40
                                    group-hover:text-primary
                                    transition-colors
                                ">
                                    {step.n}
                                </div>

                                <span className="
                                    text-[8px]
                                    font-mono
                                    tracking-[0.15em]
                                    text-muted-foreground/60
                                ">
                                    {step.phase}
                                </span>
                            </div>

                            {/* Content */}
                            <div className="relative z-10 mt-12">
                                <h3 className="
                                    text-[15px]
                                    font-semibold
                                    tracking-[-0.02em]
                                    text-foreground/90
                                ">
                                    {step.title}
                                </h3>

                                <p className="
                                    mt-2.5
                                    text-[12.5px]
                                    leading-relaxed
                                    text-muted-foreground
                                    max-w-sm
                                ">
                                    {step.desc}
                                </p>
                            </div>

                            {/* Bottom system status */}
                            <div className="
                                absolute
                                bottom-6
                                left-6
                                right-6
                                flex
                                items-center
                                justify-between
                            ">
                                <div className="
                                    flex
                                    items-center
                                    gap-2
                                ">
                                    <span className="
                                        size-1.5
                                        rounded-full
                                        bg-primary/60
                                        group-hover:bg-primary
                                        group-hover:shadow-[0_0_8px_oklch(0.72_0.18_280/0.5)]
                                        transition-all
                                    " />

                                    <span className="
                                        text-[8px]
                                        font-mono
                                        tracking-[0.12em]
                                        text-muted-foreground/60
                                    ">
                                        {step.meta}
                                    </span>
                                </div>

                                {index < steps.length - 1 && (
                                    <ArrowRight className="
                                        hidden
                                        md:block
                                        size-3
                                        text-muted-foreground/60
                                        group-hover:text-primary/60
                                        transition-colors
                                    " />
                                )}
                            </div>

                            {/* Corner registration mark */}
                            <div className="
                                absolute
                                bottom-0
                                right-0
                                size-3
                                border-b
                                border-r
                                border-border/60
                                group-hover:border-primary/30
                                transition-colors
                            " />
                        </div>
                    ))}
                </div>

                {/* ───────────── BOTTOM ANNOTATION ───────────── */}
                <div className="
                    mt-5
                    flex
                    items-center
                    justify-between
                    text-[8px]
                    font-mono
                    tracking-[0.12em]
                    text-muted-foreground/60
                    uppercase
                ">
                    <span>Sequence / 01—03</span>

                    <div className="
                        hidden
                        sm:flex
                        items-center
                        gap-3
                    ">
                        <span>Configure</span>
                        <span className="w-8 h-px bg-border" />
                        <span>Execute</span>
                        <span className="w-8 h-px bg-border" />
                        <span>Ship</span>
                    </div>

                    <span>System / Ready</span>
                </div>
            </div>
        </section>
    );
}

/* ---------------- PRICING ---------------- */

function Pricing() {
    const tiers = [
        {
            name: "Free",
            code: "PLAN / 01",
            price: "$0",
            suffix: "/mo",
            desc: "For small teams getting started.",
            features: [
                "Up to 10 members",
                "Unlimited projects",
                "Real-time updates",
                "7-day history",
            ],
            cta: "Start free",
            highlight: false,
        },
        {
            name: "Pro",
            code: "PLAN / 02",
            price: "$8",
            suffix: "/user /mo",
            desc: "For teams that ship continuously.",
            features: [
                "Unlimited members",
                "Advanced filters",
                "Custom roles",
                "Unlimited history",
                "Priority support",
            ],
            cta: "Start 14-day trial",
            highlight: true,
        },
        {
            name: "Enterprise",
            code: "PLAN / 03",
            price: "Custom",
            suffix: "",
            desc: "For organizations operating at scale.",
            features: [
                "SAML SSO",
                "Audit logs",
                "Custom contracts",
                "Dedicated CSM",
                "99.99% SLA",
            ],
            cta: "Contact sales",
            highlight: false,
        },
    ];

    return (
        <section
            id="pricing"
            className="
                relative
                py-28
                px-4
                sm:px-6
                border-t
                border-border
                overflow-hidden
            "
        >
            {/* Subtle background grid */}
            <div
                className="
                    absolute
                    inset-0
                    pointer-events-none
                    opacity-[0.018]
                "
                style={{
                    backgroundImage: `
                        linear-gradient(oklch(1 0 0 / 1) 1px, transparent 1px),
                        linear-gradient(90deg, oklch(1 0 0 / 1) 1px, transparent 1px)
                    `,
                    backgroundSize: "40px 40px",
                }}
            />

            <div className="relative max-w-5xl mx-auto">
                {/* Header */}
                <div className="max-w-2xl mb-14">
                    <div className="
                        inline-flex
                        items-center
                        gap-3
                        mb-6
                        text-[9px]
                        font-mono
                        tracking-[0.2em]
                        text-muted-foreground/60
                        uppercase
                    ">
                        <span className="w-6 h-px bg-border" />
                        Fig. 06 — Rate Sheet
                        <span className="w-6 h-px bg-border" />
                    </div>

                    <h2 className="
                        text-3xl
                        sm:text-4xl
                        md:text-[2.8rem]
                        font-semibold
                        tracking-[-0.045em]
                        leading-[1.05]
                    ">
                        Simple pricing.
                        <br />
                        <span className="text-muted-foreground/60">
                            No surprises.
                        </span>
                    </h2>

                    <p className="
                        mt-5
                        max-w-lg
                        text-[13px]
                        sm:text-[14px]
                        leading-relaxed
                        text-muted-foreground
                    ">
                        Start free, upgrade when your team needs more.
                        Every plan keeps the same focused workspace.
                    </p>
                </div>

                {/* Pricing grid */}
                <div className="
                    grid
                    md:grid-cols-3
                    gap-px
                    bg-border
                    border
                    border-border
                ">
                    {tiers.map((tier) => (
                        <div
                            key={tier.name}
                            className={`
                                group
                                relative
                                flex
                                flex-col
                                min-h-[430px]
                                p-6
                                sm:p-7
                                bg-background
                                overflow-hidden
                                transition-colors
                                duration-300
                                ${tier.highlight
                                    ? "bg-surface/40"
                                    : "hover:bg-surface/30"
                                }
                            `}
                        >
                            {/* Pro ambient glow */}
                            {tier.highlight && (
                                <div className="
                                    absolute
                                    -top-32
                                    -right-32
                                    size-64
                                    rounded-full
                                    bg-primary/10
                                    blur-3xl
                                    pointer-events-none
                                " />
                            )}

                            {/* Recommended marker */}
                            {tier.highlight && (
                                <div className="
                                    absolute
                                    top-0
                                    right-0
                                    px-2.5
                                    py-1.5
                                    bg-primary
                                    text-primary-foreground
                                    text-[8px]
                                    font-mono
                                    tracking-[0.12em]
                                    uppercase
                                ">
                                    Recommended
                                </div>
                            )}

                            {/* Plan metadata */}
                            <div className="
                                relative
                                z-10
                                flex
                                items-center
                                justify-between
                            ">
                                <span className="
                                    text-[9px]
                                    font-mono
                                    tracking-[0.15em]
                                    text-muted-foreground/60
                                ">
                                    {tier.code}
                                </span>

                                <span className="
                                    size-1.5
                                    rounded-full
                                    bg-border
                                    group-hover:bg-primary/60
                                    transition-colors
                                " />
                            </div>

                            {/* Name */}
                            <div className="relative z-10 mt-10">
                                <h3 className="
                                    text-[16px]
                                    font-semibold
                                    tracking-[-0.02em]
                                ">
                                    {tier.name}
                                </h3>

                                <p className="
                                    mt-1.5
                                    text-[11.5px]
                                    text-muted-foreground
                                ">
                                    {tier.desc}
                                </p>
                            </div>

                            {/* Price */}
                            <div className="
                                relative
                                z-10
                                mt-7
                                flex
                                items-baseline
                                gap-1.5
                            ">
                                <span className="
                                    text-3xl
                                    font-semibold
                                    tracking-[-0.04em]
                                ">
                                    {tier.price}
                                </span>

                                {tier.suffix && (
                                    <span className="
                                        text-[10px]
                                        font-mono
                                        text-muted-foreground/60
                                    ">
                                        {tier.suffix}
                                    </span>
                                )}
                            </div>

                            {/* Divider */}
                            <div className="
                                relative
                                z-10
                                my-7
                                h-px
                                bg-border
                            " />

                            {/* Features */}
                            <ul className="
                                relative
                                z-10
                                space-y-3
                                flex-1
                            ">
                                {tier.features.map((feature) => (
                                    <li
                                        key={feature}
                                        className="
                                            flex
                                            items-center
                                            gap-2.5
                                            text-[12px]
                                        "
                                    >
                                        <span className="
                                            size-1
                                            rounded-full
                                            bg-primary/60
                                            shrink-0
                                        " />

                                        <span className="
                                            text-foreground/75
                                        ">
                                            {feature}
                                        </span>
                                    </li>
                                ))}
                            </ul>

                            {/* CTA */}
                            <Link
                                to={
                                    tier.name === "Enterprise"
                                        ? "/contact"
                                        : "/signup"
                                }
                                className={`
                                    relative
                                    z-10
                                    mt-8
                                    h-10
                                    w-full
                                    inline-flex
                                    items-center
                                    justify-center
                                    gap-2
                                    text-[12px]
                                    font-medium
                                    transition-all
                                    ${tier.highlight
                                        ? `
                                                bg-primary
                                                text-primary-foreground
                                                hover:bg-primary/90
                                            `
                                        : `
                                                border
                                                border-border
                                                bg-card
                                                hover:bg-surface-elevated
                                                hover:border-border/80
                                            `
                                    }
                                `}
                            >
                                {tier.cta}

                                <ArrowRight className="
                                    size-3
                                    opacity-60
                                    transition-transform
                                    group-hover:translate-x-0.5
                                " />
                            </Link>

                            {/* Registration corner */}
                            <div className="
                                absolute
                                bottom-0
                                right-0
                                size-3
                                border-b
                                border-r
                                border-border/50
                            " />
                        </div>
                    ))}
                </div>

                {/* Bottom annotation */}
                <div className="
                    mt-5
                    flex
                    items-center
                    justify-between
                    text-[8px]
                    font-mono
                    tracking-[0.12em]
                    text-muted-foreground/60
                    uppercase
                ">
                    <span>Billing / Monthly</span>

                    <span>All plans include core workspace</span>

                    <span>Cancel / Anytime</span>
                </div>
            </div>
        </section>
    );
}

/* ---------------- CTA ---------------- */

function FinalCTA() {
    return (
        <section
            className="
                relative
                py-32
                px-4
                sm:px-6
                border-t
                border-border
                overflow-hidden
            "
        >
            {/* Drafting grid */}
            <div
                className="
                    absolute
                    inset-0
                    pointer-events-none
                    opacity-[0.025]
                "
                style={{
                    backgroundImage: `
                        linear-gradient(oklch(1 0 0 / 1) 1px, transparent 1px),
                        linear-gradient(90deg, oklch(1 0 0 / 1) 1px, transparent 1px)
                    `,
                    backgroundSize: "40px 40px",
                }}
            />

            {/* Central glow */}
            <div className="
                absolute
                left-1/2
                top-1/2
                -translate-x-1/2
                -translate-y-1/2
                size-[420px]
                rounded-full
                bg-primary/[0.07]
                blur-[120px]
                pointer-events-none
            " />

            <div className="
                relative
                max-w-4xl
                mx-auto
                text-center
            ">
                {/* Figure label */}
                <div className="
                    inline-flex
                    items-center
                    gap-3
                    mb-7
                    text-[9px]
                    font-mono
                    tracking-[0.2em]
                    text-muted-foreground/60
                    uppercase
                ">
                    <span className="w-6 h-px bg-border" />
                    Fig. 07 — Handoff
                    <span className="w-6 h-px bg-border" />
                </div>

                {/* Heading */}
                <h2 className="
                    text-4xl
                    sm:text-5xl
                    md:text-[4.2rem]
                    font-semibold
                    tracking-[-0.055em]
                    leading-[0.98]
                ">
                    Put the work
                    <br />
                    <span className="text-primary">
                        on the surface.
                    </span>
                </h2>

                <p className="
                    mt-6
                    max-w-lg
                    mx-auto
                    text-[13px]
                    sm:text-[14px]
                    leading-relaxed
                    text-muted-foreground
                ">
                    Start a workspace for your team and see what
                    project management feels like without the noise.
                </p>

                {/* CTA */}
                <div className="
                    mt-9
                    flex
                    flex-col
                    sm:flex-row
                    items-center
                    justify-center
                    gap-2.5
                ">
                    <Link
                        to="/signup"
                        className="
                            group
                            h-11
                            px-6
                            inline-flex
                            items-center
                            justify-center
                            gap-2
                            rounded-md
                            bg-primary
                            text-primary-foreground
                            text-[13px]
                            font-medium
                            shadow-lg
                            shadow-primary/10
                            hover:bg-primary/90
                            hover:shadow-primary/20
                            transition-all
                        "
                    >
                        Start your workspace

                        <ArrowRight className="
                            size-3.5
                            transition-transform
                            duration-200
                            group-hover:translate-x-0.5
                        " />
                    </Link>

                    <span className="
                        text-[9px]
                        font-mono
                        tracking-[0.12em]
                        text-muted-foreground/60
                        uppercase
                    ">
                        Free to start · No card required
                    </span>
                </div>

                {/* Technical footer */}
                <div className="
                    mt-16
                    pt-5
                    border-t
                    border-border/60
                    flex
                    flex-col
                    sm:flex-row
                    items-center
                    justify-between
                    gap-3
                    text-[8px]
                    font-mono
                    tracking-[0.12em]
                    text-muted-foreground/60
                    uppercase
                ">
                    <span>DEVFLOW / CORE SYSTEM</span>

                    <span className="hidden sm:block">
                        FINAL REVISION / 07
                    </span>

                    <span className="text-primary/50">
                        STATUS / READY
                    </span>
                </div>
            </div>
        </section>
    );
}

/* ---------------- FOOTER ---------------- */


function Footer({ onSmoothScroll }: { onSmoothScroll: (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => void }) {
    const productLinks = [
        { label: "Features", href: "#features" },
        { label: "Workflow", href: "#workflow" },
        { label: "Pricing", href: "#pricing" },
    ];

    const companyLinks = [
        { label: "About", href: "#" },
        { label: "Contact", href: "/contact" },
        { label: "Changelog", href: "#" },
    ];

    const legalLinks = [
        { label: "Privacy", href: "#" },
        { label: "Terms", href: "#" },
    ];

    return (
        <footer className="relative border-t border-border overflow-hidden">
            {/* ───────────────── BACKGROUND GRID ───────────────── */}
            <div
                className="
                    absolute
                    inset-0
                    pointer-events-none
                    opacity-[0.018]
                "
                style={{
                    backgroundImage: `
                        linear-gradient(oklch(1 0 0 / 1) 1px, transparent 1px),
                        linear-gradient(90deg, oklch(1 0 0 / 1) 1px, transparent 1px)
                    `,
                    backgroundSize: "40px 40px",
                }}
            />

            {/* ───────────────── TOP TECHNICAL BAR ───────────────── */}
            <div className="
                relative
                border-b
                border-border
                bg-sidebar/20
            ">
                <div className="
                    max-w-6xl
                    mx-auto
                    px-4
                    sm:px-6
                    h-9
                    flex
                    items-center
                    justify-between
                    font-mono
                    text-[8px]
                    tracking-[0.14em]
                    text-muted-foreground/60
                    uppercase
                ">
                    <span>DEVFLOW / CORE SYSTEM</span>

                    <div className="
                        flex
                        items-center
                        gap-3
                    ">
                        <span>REV. 01</span>

                        <span className="
                            w-px
                            h-3
                            bg-border
                        " />

                        <span className="
                            flex
                            items-center
                            gap-1.5
                            text-primary/50
                        ">
                            <span className="
                                size-1.5
                                rounded-full
                                bg-primary/70
                                shadow-[0_0_7px_oklch(0.72_0.18_280/0.4)]
                            " />

                            SYSTEM / READY
                        </span>
                    </div>
                </div>
            </div>

            {/* ───────────────── MAIN FOOTER ───────────────── */}
            <div className="
                relative
                max-w-6xl
                mx-auto
                px-4
                sm:px-6
                py-14
                sm:py-16
            ">
                <div className="
                    grid
                    lg:grid-cols-[1.8fr_1fr_1fr_1fr]
                    gap-12
                    lg:gap-8
                ">
                    {/* ───────── BRAND ───────── */}
                    <div className="max-w-sm">
                        <Link
                            to="/"
                            className="flex items-center gap-2.5 group"
                        >
                            <img
                                src={logo}
                                alt="DevFlow logo"
                                className="size-8 object-contain transition-transform duration-200 group-hover:scale-105"
                            />

                            <span className="text-[15px] font-semibold tracking-tight text-slate-100 flex items-baseline gap-[1px]">
                                Dev<span className="font-mono text-[13px] font-medium text-[oklch(0.72_0.20_290)]">FLOW</span>
                            </span>
                        </Link>

                        <p className="
                            mt-5
                            text-[12px]
                            leading-relaxed
                            text-muted-foreground
                            max-w-xs
                        ">
                            A project workspace built like a drafting
                            surface — focused, spatial, and always in motion.
                        </p>

                        {/* Small technical label */}
                        <div className="
                            mt-6
                            inline-flex
                            items-center
                            gap-2
                            text-[8px]
                            font-mono
                            tracking-[0.14em]
                            text-muted-foreground/60
                            uppercase
                        ">
                            <span className="
                                w-4
                                h-px
                                bg-border
                            " />

                            Workspace / 01

                            <span className="
                                w-4
                                h-px
                                bg-border
                            " />
                        </div>
                    </div>

                    {/* ───────── PRODUCT ───────── */}
                    <div>
                        <p className="
                            text-[8px]
                            font-mono
                            tracking-[0.16em]
                            text-muted-foreground/60
                            uppercase
                            mb-5
                        ">
                            Product
                        </p>

                        <nav className="flex flex-col gap-3">
                            {productLinks.map((link) => (
                                <a
                                    key={link.label}
                                    href={link.href}
                                    onClick={(e) => {
                                        if (link.href.startsWith('#')) {
                                            onSmoothScroll(e, link.href);
                                        }
                                    }}
                                    className="
                                        w-fit
                                        text-[12px]
                                        text-muted-foreground
                                        hover:text-foreground
                                        transition-colors
                                    "
                                >
                                    {link.label}
                                </a>
                            ))}
                        </nav>
                    </div>

                    {/* ───────── COMPANY ───────── */}
                    <div>
                        <p className="
                            text-[8px]
                            font-mono
                            tracking-[0.16em]
                            text-muted-foreground/60
                            uppercase
                            mb-5
                        ">
                            Company
                        </p>

                        <nav className="flex flex-col gap-3">
                            {companyLinks.map((link) => (
                                <Link
                                    key={link.label}
                                    to={link.href}
                                    className="
                                        w-fit
                                        text-[12px]
                                        text-muted-foreground
                                        hover:text-foreground
                                        transition-colors
                                    "
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {/* ───────── LEGAL ───────── */}
                    <div>
                        <p className="
                            text-[8px]
                            font-mono
                            tracking-[0.16em]
                            text-muted-foreground/60
                            uppercase
                            mb-5
                        ">
                            System
                        </p>

                        <nav className="flex flex-col gap-3">
                            {legalLinks.map((link) => (
                                <Link
                                    key={link.label}
                                    to={link.href}
                                    className="
                                        w-fit
                                        text-[12px]
                                        text-muted-foreground
                                        hover:text-foreground
                                        transition-colors
                                    "
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>
                    </div>
                </div>

                {/* ───────────────── DIVIDER ───────────────── */}
                <div className="
                    mt-14
                    pt-5
                    border-t
                    border-border
                    flex
                    flex-col
                    sm:flex-row
                    items-start
                    sm:items-center
                    justify-between
                    gap-4
                ">
                    <div className="
                        flex
                        items-center
                        gap-3
                        text-[8px]
                        font-mono
                        tracking-[0.12em]
                        text-muted-foreground/60
                        uppercase
                    ">
                        <span>© {new Date().getFullYear()} DevFlow</span>

                        <span className="
                            hidden
                            sm:block
                            w-px
                            h-3
                            bg-border
                        " />

                        <span className="hidden sm:block">
                            All systems operational
                        </span>
                    </div>

                    <div className="
                        flex
                        items-center
                        gap-4
                        text-[8px]
                        font-mono
                        tracking-[0.12em]
                        text-muted-foreground/60
                        uppercase
                    ">
                        <span>Built for teams</span>

                        <span className="
                            size-1
                            rounded-full
                            bg-primary/50
                        " />

                        <span>v1.0</span>
                    </div>
                </div>
            </div>

            {/* ───────────────── BOTTOM REGISTRATION MARK ───────────────── */}
            <div className="
                absolute
                bottom-0
                left-0
                size-4
                border-b
                border-l
                border-border/60
            " />

            <div className="
                absolute
                bottom-0
                right-0
                size-4
                border-b
                border-r
                border-border/60
            " />
        </footer>
    );
}