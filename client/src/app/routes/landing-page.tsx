import { useEffect, useState } from "react";
import logo from '../../assets/logo.png';
import { LoadingSkeleton } from "../../components/ui/landing-skeleton";
import {
    ArrowRight,
    Zap,
    Users,
    MessageSquare,
    Bell,
    Lock,
    Layers,
    Check
} from "lucide-react";
import { Link } from "react-router";
import { useShouldShowLoader } from "../../utils/useShouldShowLoader";

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
            <CTA />
            <Footer />
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

function Hero() {
    return (
        <section className="relative pt-24 pb-28 px-4 sm:px-6 overflow-hidden">
            {/* Outer drafting sheet */}
            <div className="absolute inset-4 md:inset-8 -z-10 rounded-xl border border-border/40 bg-background/40">
                {/* Grid */}
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

            {/* Registration marks — tighter & more precise */}
            {[
                "top-3 left-3 border-t border-l",
                "top-3 right-3 border-t border-r",
                "bottom-3 left-3 border-b border-l",
                "bottom-3 right-3 border-b border-r",
            ].map((pos) => (
                <div
                    key={pos}
                    className={`absolute ${pos} size-2.5 border-primary/40 -z-10`}
                />
            ))}

            {/* Content */}
            <div className="max-w-3xl mx-auto text-center pt-3">
                {/* Annotation label */}
                <div className="inline-flex items-center gap-3 mb-7 text-[10px] font-mono tracking-[0.18em] text-muted-foreground/60 uppercase">
                    <span className="w-5 h-px bg-border" />
                    Fig. 01 — Surface
                    <span className="w-5 h-px bg-border" />
                </div>

                {/* Headline */}
                <h1 className="text-[2.6rem] md:text-[3.35rem] font-semibold tracking-[-0.038em] leading-[1.07] text-balance">
                    A project tool that behaves like
                    <br />
                    a drafting surface,{" "}
                    <span className="text-muted-foreground/55">not a dashboard.</span>
                </h1>

                {/* Scale bar — more intentional */}
                <div className="mt-8 mb-8 flex flex-col items-center gap-1.5">
                    <div className="flex items-end gap-[3px]">
                        {Array.from({ length: 17 }).map((_, i) => (
                            <span
                                key={i}
                                className="bg-border/80"
                                style={{
                                    width: "1px",
                                    height: i % 4 === 0 ? "11px" : i % 2 === 0 ? "7px" : "4px",
                                }}
                            />
                        ))}
                    </div>
                </div>

                <p className="text-[14.5px] md:text-[15px] text-muted-foreground max-w-md mx-auto leading-relaxed text-balance">
                    Workspaces, kanban, and threaded discussion that stay on the same plane.
                    Built for teams that want clarity without the noise of traditional trackers.
                </p>

                {/* CTAs — flush, no glow */}
                <div className="mt-9 flex items-center justify-center gap-2.5">
                    <Link
                        to="/signup"
                        className="h-9.5 px-4.5 rounded-md bg-primary text-primary-foreground text-[13px] font-medium hover:bg-primary/90 transition-colors inline-flex items-center gap-1.5 border border-primary/70"
                    >
                        Start a workspace
                        <ArrowRight className="size-3.5 opacity-80" />
                    </Link>

                    <Link
                        to="/app"
                        className="h-9.5 px-4.5 rounded-md border border-border/80 text-[13px] font-medium text-foreground/85 hover:bg-surface-elevated hover:border-border transition-colors inline-flex items-center"
                    >
                        Explore the system
                    </Link>
                </div>

                <p className="mt-5 text-[10px] font-mono tracking-[0.12em] text-muted-foreground/50 uppercase">
                    Free up to 10 seats · No card required
                </p>
            </div>

            {/* Product block */}
            <div className="max-w-6xl mx-auto mt-20 relative">
                <div className="flex items-center justify-between mb-3 px-1">
                    <p className="text-[10px] font-mono tracking-[0.14em] text-muted-foreground/50 uppercase">
                        Fig. 02 — Admin View
                    </p>
                    <p className="text-[10px] font-mono tracking-wide text-muted-foreground/40">
                        Sheet 01 / 01
                    </p>
                </div>

                <div className="relative border border-border/60 bg-surface/20 p-1">
                    <div className="border border-border/40 bg-background overflow-hidden">
                        <ProductPreview />
                    </div>
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
                <span className="text-[8.5px] font-mono text-muted-foreground/80 tracking-wide">
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
                <span className="text-[8.5px] text-muted-foreground/70 font-mono">
                    Apr {18 + variant}
                </span>
            </div>
        </div>
    );
}

/* ---------------- LOGOS ---------------- */

function LogoStrip() {
    // Replace with real, verified customer logos before shipping —
    // never list a company here without their sign-off.
    const refs = [
        "Northwind",
        "Fieldstone",
        "Aperture",
        "Redline",
        "Basecamp Labs",
        "Trestle",
    ];

    return (
        <section className="relative py-7 border-y border-border/60 bg-sidebar/30">
            {/* subtle continuation of the drafting grid */}
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
                {/* Annotation label — centered above */}
                <div className="flex items-center justify-center gap-3 mb-4">
                    <span className="w-5 h-px bg-border" />
                    <span className="text-[10px] font-mono tracking-[0.16em] text-muted-foreground/60 uppercase">
                        Ref. Teams
                    </span>
                    <span className="w-5 h-px bg-border" />
                </div>

                {/* Names — fully centered */}
                <div className="flex flex-wrap items-center justify-center gap-x-9 gap-y-2.5">
                    {refs.map((name) => (
                        <span
                            key={name}
                            className="text-[13px] font-medium tracking-tight text-foreground/45 hover:text-foreground/75 transition-colors duration-150"
                        >
                            {name}
                        </span>
                    ))}
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
            title: "Real-time everything",
            desc: "Cards move, comments stream, and presence updates instantly. No refresh, ever.",
        },
        {
            icon: Layers,
            title: "Kanban that scales",
            desc: "Drag, drop, filter, and group. Built to stay fast at 10 issues or 10,000.",
        },
        {
            icon: MessageSquare,
            title: "Threaded discussions",
            desc: "Nested replies, mentions, and rich comments keep context with the work.",
        },
        {
            icon: Lock,
            title: "Role-based access",
            desc: "Admins, members, and viewers — each role sees exactly what they should.",
        },
        {
            icon: Bell,
            title: "Smart notifications",
            desc: "Get notified when it matters. Mute when it doesn't. Mark all read in one click.",
        },
        {
            icon: Users,
            title: "Workspaces that fit",
            desc: "Multiple workspaces, pending invites, and granular project permissions.",
        },
    ];

    return (
        <section id="features" className="py-24 px-4 sm:px-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-14">
                    <div className="inline-flex items-center gap-3 mb-5 text-[10px] font-mono tracking-[0.16em] text-muted-foreground/60 uppercase">
                        <span className="w-5 h-px bg-border" />
                        Fig. 03 — Instruments
                        <span className="w-5 h-px bg-border" />
                    </div>
                    <h2 className="text-3xl md:text-[2.5rem] font-semibold tracking-[-0.03em] leading-tight">
                        Six instruments.
                        <br />
                        <span className="text-muted-foreground/60">One surface.</span>
                    </h2>
                </div>

                {/* Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-border border border-border">
                    {features.map((f) => (
                        <div
                            key={f.title}
                            className="bg-background p-6 hover:bg-surface/40 transition-colors group"
                        >
                            <div className="size-8 border border-border flex items-center justify-center mb-4 text-foreground/65 group-hover:border-primary/40 group-hover:text-primary transition-colors">
                                <f.icon className="size-3.5" strokeWidth={2} />
                            </div>
                            <h3 className="text-[13px] font-semibold mb-1.5 tracking-tight">
                                {f.title}
                            </h3>
                            <p className="text-[12.5px] text-muted-foreground leading-relaxed">
                                {f.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
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
            live: true,
        },
        {
            name: "Marcus",
            initials: "MJ",
            action: "commented on",
            ref: "DEV-219",
            time: "2s ago",
        },
        {
            name: "Priya",
            initials: "PS",
            action: "pushed fix on",
            ref: "DEV-198",
            time: "2m ago",
        },
    ];

    return (
        <section className="py-24 px-4 sm:px-6 border-t border-border bg-sidebar/25">
            <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-14 lg:gap-16 items-center">
                {/* Copy */}
                <div>
                    <div className="inline-flex items-center gap-3 mb-5 text-[10px] font-mono tracking-[0.16em] text-muted-foreground/60 uppercase">
                        <span className="w-5 h-px bg-border" />
                        Fig. 04 — Activity
                        <span className="w-5 h-px bg-border" />
                    </div>

                    <h2 className="text-3xl md:text-[2.5rem] font-semibold tracking-[-0.03em] leading-tight">
                        See your team move
                        <br />
                        in real time.
                    </h2>

                    <p className="text-[15px] text-muted-foreground mt-5 leading-relaxed max-w-md">
                        Watch issues drift across the board as your team works. Comments
                        appear as they're typed. DevFlow keeps everyone on the same plane.
                    </p>

                    <ul className="mt-8 space-y-2.5">
                        {[
                            "Sub-100ms updates over WebSockets",
                            "Live cursors and presence avatars",
                            "Optimistic UI with conflict resolution",
                            "Activity log that captures every change",
                        ].map((item) => (
                            <li key={item} className="flex items-center gap-2.5 text-[13px]">
                                <Check className="size-3 text-primary shrink-0" strokeWidth={2.5} />
                                <span className="text-foreground/85">{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Live log — same language as ProductPreview */}
                <div className="border border-border bg-card overflow-hidden">
                    {/* Title block — matches Hero preview exactly */}
                    <div className="h-8 border-b border-border bg-sidebar/80 flex items-center px-3.5 gap-3 font-mono text-[9.5px] tracking-wide text-muted-foreground">
                        <span className="text-foreground/60">LOG</span>
                        <span className="text-foreground/80">ACTIVITY STREAM</span>
                        <span className="w-px h-2.5 bg-border" />
                        <span>LIVE</span>
                        <span className="ml-auto flex items-center gap-1.5 text-primary">
                            <span className="size-1 rounded-full bg-primary animate-pulse" />
                            STREAMING
                        </span>
                    </div>

                    {/* Events */}
                    <div className="divide-y divide-border">
                        {events.map((e) => (
                            <div
                                key={e.ref + e.time}
                                className={`p-3 flex items-center gap-2.5 ${e.live ? "bg-primary/[0.03]" : ""
                                    }`}
                            >
                                <div className="size-6 flex items-center justify-center border border-border text-[9px] font-mono text-muted-foreground shrink-0">
                                    {e.initials}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <p className="text-[11.5px] leading-snug">
                                        <span className="font-medium text-foreground/90">{e.name}</span>{" "}
                                        {e.action}{" "}
                                        <span className="font-mono text-muted-foreground">{e.ref}</span>
                                        {e.target && (
                                            <>
                                                {" "}
                                                →{" "}
                                                <span className="text-status-review font-medium">
                                                    {e.target}
                                                </span>
                                            </>
                                        )}
                                    </p>
                                    <p className="text-[9.5px] font-mono text-muted-foreground/60 mt-0.5">
                                        {e.time}
                                    </p>
                                </div>

                                {e.live && (
                                    <span className="text-[9px] font-mono text-primary tracking-wide shrink-0">
                                        LIVE
                                    </span>
                                )}
                            </div>
                        ))}

                        {/* Nested comment — same density as MiniCard */}
                        <div className="p-3">
                            <div className="flex items-start gap-2.5">
                                <div className="size-6 flex items-center justify-center border border-border text-[9px] font-mono text-muted-foreground shrink-0">
                                    PS
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-[11.5px] font-medium">Priya</span>
                                        <span className="text-[9.5px] font-mono text-muted-foreground/60">
                                            2m
                                        </span>
                                    </div>
                                    <p className="text-[11.5px] text-foreground/80 mt-0.5 leading-snug">
                                        Pushed a fix for the token refresh edge case. Ready for review.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-2.5 mt-2.5 ml-8">
                                <div className="size-5 flex items-center justify-center border border-border text-[8px] font-mono text-muted-foreground shrink-0">
                                    AR
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-[11px] font-medium">Alex</span>
                                        <span className="text-[9.5px] font-mono text-muted-foreground/60">
                                            just now
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-foreground/70 mt-0.5">
                                        LGTM, merging now.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

/* ---------------- WORKFLOW ---------------- */

function Workflow() {
    const steps = [
        {
            n: "01",
            title: "Create your workspace",
            desc: "Sign up in seconds. Invite your team by email or share a link.",
        },
        {
            n: "02",
            title: "Spin up a project",
            desc: "Pick a template or start blank. Configure columns to match your flow.",
        },
        {
            n: "03",
            title: "Track, discuss, ship",
            desc: "Drag issues across the board. Comment in threads. Watch your team move in real time.",
        },
    ];

    return (
        <section id="workflow" className="py-24 px-4 sm:px-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-14">
                    <div className="inline-flex items-center gap-3 mb-5 text-[10px] font-mono tracking-[0.16em] text-muted-foreground/60 uppercase">
                        <span className="w-5 h-px bg-border" />
                        Fig. 05 — Sequence
                        <span className="w-5 h-px bg-border" />
                    </div>
                    <h2 className="text-3xl md:text-[2.5rem] font-semibold tracking-[-0.03em] leading-tight">
                        From signup to shipping
                        <br />
                        <span className="text-muted-foreground/60">in under 5 minutes.</span>
                    </h2>
                </div>

                {/* Steps */}
                <div className="relative grid md:grid-cols-3 gap-px bg-border border border-border">
                    {/* connecting line */}
                    <div className="hidden md:block absolute top-[42px] left-[16.6%] right-[16.6%] h-px bg-border/80 -z-10" />

                    {steps.map((s) => (
                        <div
                            key={s.n}
                            className="bg-background p-6 hover:bg-surface/40 transition-colors"
                        >
                            <div className="size-8 border border-border bg-card flex items-center justify-center font-mono text-[11px] text-muted-foreground mb-5">
                                {s.n}
                            </div>
                            <h3 className="text-[13px] font-semibold mb-1.5 tracking-tight">
                                {s.title}
                            </h3>
                            <p className="text-[12.5px] text-muted-foreground leading-relaxed">
                                {s.desc}
                            </p>
                        </div>
                    ))}
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
            price: "$0",
            desc: "For small teams getting started",
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
            price: "$8",
            desc: "Per user / month",
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
            price: "Custom",
            desc: "For organizations at scale",
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
            className="py-24 px-4 sm:px-6 border-t border-border bg-sidebar/25"
        >
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="text-center mb-14">
                    <div className="inline-flex items-center gap-3 mb-5 text-[10px] font-mono tracking-[0.16em] text-muted-foreground/60 uppercase">
                        <span className="w-5 h-px bg-border" />
                        Fig. 06 — Rate Sheet
                        <span className="w-5 h-px bg-border" />
                    </div>
                    <h2 className="text-3xl md:text-[2.5rem] font-semibold tracking-[-0.03em] leading-tight">
                        Simple pricing.
                        <br />
                        <span className="text-muted-foreground/60">Cancel anytime.</span>
                    </h2>
                </div>

                {/* Tiers — gap between cards + equal height */}
                <div className="grid md:grid-cols-3 gap-4">
                    {tiers.map((t) => (
                        <div
                            key={t.name}
                            className={`relative flex flex-col border border-border bg-background p-6 transition-colors ${t.highlight ? "bg-surface/30 border-primary/40" : ""
                                }`}
                        >
                            {t.highlight && (
                                <div className="absolute top-0 right-0 px-2 py-1 bg-primary text-primary-foreground text-[9px] font-mono tracking-wide">
                                    RECOMMENDED
                                </div>
                            )}

                            <h3 className="text-[13px] font-semibold tracking-tight">
                                {t.name}
                            </h3>

                            <div className="mt-3 flex items-baseline gap-1">
                                <span className="text-2xl font-semibold tracking-tight">
                                    {t.price}
                                </span>
                                {t.price !== "Custom" && (
                                    <span className="text-[11px] text-muted-foreground">/mo</span>
                                )}
                            </div>

                            <p className="text-[12px] text-muted-foreground mt-1">{t.desc}</p>

                            <ul className="mt-6 space-y-2 flex-1">
                                {t.features.map((f) => (
                                    <li key={f} className="flex items-center gap-2 text-[12.5px]">
                                        <Check
                                            className="size-3 text-primary shrink-0"
                                            strokeWidth={2.5}
                                        />
                                        <span className="text-foreground/85">{f}</span>
                                    </li>
                                ))}
                            </ul>

                            {/* Button always sits at the bottom */}
                            <Link
                                to="/signup"
                                className={`mt-7 h-9 w-full text-[13px] font-medium inline-flex items-center justify-center transition-colors ${t.highlight
                                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                                    : "border border-border bg-card hover:bg-surface"
                                    }`}
                            >
                                {t.cta}
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ---------------- CTA ---------------- */

function CTA() {
    return (
        <section className="py-24 px-4 sm:px-6">
            <div className="max-w-6xl mx-auto relative border border-border bg-sidebar/40 overflow-hidden px-8 py-16 text-center">
                {/* Registration marks */}
                {[
                    "top-3 left-3 border-t border-l",
                    "top-3 right-3 border-t border-r",
                    "bottom-3 left-3 border-b border-l",
                    "bottom-3 right-3 border-b border-r",
                ].map((pos) => (
                    <div
                        key={pos}
                        className={`absolute ${pos} size-2.5 border-primary/40`}
                    />
                ))}

                {/* Grid */}
                <div
                    className="absolute inset-0 opacity-[0.04] pointer-events-none"
                    style={{
                        backgroundImage: `
              linear-gradient(oklch(1 0 0 / 1) 1px, transparent 1px),
              linear-gradient(90deg, oklch(1 0 0 / 1) 1px, transparent 1px)
            `,
                        backgroundSize: "32px 32px",
                    }}
                />

                <div className="relative">
                    <div className="inline-flex items-center gap-3 mb-5 text-[10px] font-mono tracking-[0.16em] text-muted-foreground/60 uppercase">
                        <span className="w-5 h-px bg-border" />
                        Fig. 07 — Close
                        <span className="w-5 h-px bg-border" />
                    </div>

                    <h2 className="text-3xl md:text-[2.5rem] font-semibold tracking-[-0.03em] leading-tight">
                        Start your first workspace.
                    </h2>

                    <p className="text-[15px] text-muted-foreground mt-4 max-w-sm mx-auto">
                        Free for teams up to 10. No credit card required.
                    </p>

                    <div className="mt-8 flex items-center justify-center gap-2.5">
                        <Link
                            to="/signup"
                            className="h-9.5 px-5 bg-primary text-primary-foreground text-[13px] font-medium hover:bg-primary/90 inline-flex items-center gap-1.5 transition-colors border border-primary/70"
                        >
                            Get started free
                            <ArrowRight className="size-3.5 opacity-80" />
                        </Link>

                        <Link
                            to="/app"
                            className="h-9.5 px-5 border border-border/80 text-[13px] font-medium text-foreground/85 hover:bg-surface transition-colors inline-flex items-center"
                        >
                            Try the demo
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}

/* ---------------- FOOTER ---------------- */

function Footer() {
    return (
        <footer className="border-t border-border/60 py-8 px-4 sm:px-6">
            <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2.5">
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
                    <span className="text-[11px] font-mono text-muted-foreground/60 ml-1">
                        © 2026
                    </span>
                </div>

                <div className="flex items-center gap-6 text-[12px] text-muted-foreground/70">
                    <a href="#" className="hover:text-foreground transition-colors">
                        Privacy
                    </a>
                    <a href="#" className="hover:text-foreground transition-colors">
                        Terms
                    </a>
                    <a href="#" className="hover:text-foreground transition-colors">
                        Status
                    </a>
                </div>
            </div>
        </footer>
    );
}