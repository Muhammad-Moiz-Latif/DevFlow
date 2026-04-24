// import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
    CircleDot,
    ArrowRight,
    Zap,
    Users,
    MessageSquare,
    Bell,
    Lock,
    Layers,
    Check,
    Sparkles,
} from "lucide-react";
import { Link } from "react-router";

// export const Route = createFileRoute("/")({
//     head: () => ({
//         meta: [
//             { title: "DevFlow — The issue tracker product teams actually love" },
//             {
//                 name: "description",
//                 content:
//                     "Linear-grade kanban, threaded comments, and live presence in one workspace. Built for product teams that ship fast.",
//             },
//             { property: "og:title", content: "DevFlow — Issue tracking that ships" },
//             {
//                 property: "og:description",
//                 content:
//                     "Real-time kanban, threaded discussions, and role-based workspaces for modern product teams.",
//             },
//         ],
//     }),
//     component: Landing,
// });

export function LandingPage() {
    return (
        <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
            <Nav />
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

function Nav() {
    return (
        <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/70 border-b border-border/60">
            <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2">
                    <div className="size-7 rounded-md bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                        <CircleDot className="size-4 text-primary-foreground" strokeWidth={2.5} />
                    </div>
                    <span className="text-sm font-semibold tracking-tight">DevFlow</span>
                </Link>
                <nav className="hidden md:flex items-center gap-7 text-[13px] text-muted-foreground">
                    <a href="#features" className="hover:text-foreground transition-colors">Features</a>
                    <a href="#workflow" className="hover:text-foreground transition-colors">Workflow</a>
                    <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
                    <a href="#" className="hover:text-foreground transition-colors">Changelog</a>
                </nav>
                <div className="flex items-center gap-2">
                    <Link
                        to="/login"
                        className="text-[13px] text-muted-foreground hover:text-foreground px-3 h-8 inline-flex items-center transition-colors"
                    >
                        Sign in
                    </Link>
                    <Link
                        to="/signup"
                        className="text-[13px] font-medium text-primary-foreground bg-primary hover:bg-primary/90 px-3.5 h-8 rounded-md inline-flex items-center gap-1.5 transition-colors"
                    >
                        Get started
                        <ArrowRight className="size-3.5" />
                    </Link>
                </div>
            </div>
        </header>
    );
}

/* ---------------- HERO ---------------- */

function Hero() {
    return (
        <section className="relative pt-24 pb-32 px-6">
            {/* Ambient backdrop */}
            <div
                className="absolute inset-0 -z-10 opacity-60"
                style={{
                    backgroundImage:
                        "radial-gradient(ellipse 60% 50% at 50% 0%, oklch(0.72 0.18 280 / 0.25), transparent 70%), radial-gradient(ellipse 40% 30% at 80% 20%, oklch(0.68 0.17 240 / 0.18), transparent 60%)",
                }}
            />
            <div
                className="absolute inset-0 -z-10 opacity-[0.07]"
                style={{
                    backgroundImage:
                        "linear-gradient(oklch(1 0 0 / 1) 1px, transparent 1px), linear-gradient(90deg, oklch(1 0 0 / 1) 1px, transparent 1px)",
                    backgroundSize: "48px 48px",
                    maskImage: "radial-gradient(ellipse 70% 60% at 50% 30%, black, transparent)",
                }}
            />

            <div className="max-w-4xl mx-auto text-center">
                <div className="inline-flex items-center gap-2 px-3 h-7 rounded-full border border-border bg-surface/60 backdrop-blur text-[11px] font-medium text-muted-foreground mb-7">
                    <Sparkles className="size-3 text-primary" />
                    Now with real-time presence
                    <span className="text-border">•</span>
                    <span className="text-foreground">v1.4</span>
                </div>

                <h1 className="text-5xl md:text-6xl font-semibold tracking-[-0.03em] leading-[1.05]">
                    The issue tracker
                    <br />
                    <span className="bg-gradient-to-br from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent">
                        product teams actually love.
                    </span>
                </h1>
                <p className="mt-6 text-base md:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
                    Linear-grade kanban, threaded comments, and live collaboration —
                    purpose-built for engineering teams that move fast and stay aligned.
                </p>

                <div className="mt-9 flex items-center justify-center gap-3">
                    <Link
                        to="/signup"
                        className="h-10 px-5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all inline-flex items-center gap-2 shadow-[0_0_0_1px_oklch(0.72_0.18_280_/_0.4),0_8px_24px_-8px_oklch(0.72_0.18_280_/_0.5)]"
                    >
                        Start free
                        <ArrowRight className="size-4" />
                    </Link>
                    <Link
                        to="/app"
                        className="h-10 px-5 rounded-md border border-border bg-surface/60 backdrop-blur text-sm font-medium hover:bg-surface-elevated transition-colors inline-flex items-center gap-2"
                    >
                        View live demo
                    </Link>
                </div>

                <p className="mt-5 text-[11px] text-muted-foreground">
                    Free for teams up to 10 — no credit card required
                </p>
            </div>

            {/* Hero product preview */}
            <div className="max-w-5xl mx-auto mt-20 relative">
                <div className="absolute -inset-x-10 -inset-y-6 bg-gradient-to-b from-primary/20 to-transparent blur-3xl -z-10 opacity-50" />
                <ProductPreview />
            </div>
        </section>
    );
}

function ProductPreview() {
    const [tick, setTick] = useState(0);
    useEffect(() => {
        const id = setInterval(() => setTick((t) => t + 1), 2800);
        return () => clearInterval(id);
    }, []);

    const cols = [
        { name: "To Do", dot: "bg-status-todo", count: 4 },
        { name: "In Progress", dot: "bg-status-progress", count: 3 },
        { name: "In Review", dot: "bg-status-review", count: 2 },
        { name: "Done", dot: "bg-status-done", count: 8 },
    ];

    return (
        <div className="rounded-xl border border-border bg-card shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)] overflow-hidden">
            {/* fake window chrome */}
            <div className="h-9 border-b border-border bg-sidebar flex items-center px-3 gap-2">
                <div className="flex gap-1.5">
                    <span className="size-2.5 rounded-full bg-priority-urgent/60" />
                    <span className="size-2.5 rounded-full bg-priority-high/60" />
                    <span className="size-2.5 rounded-full bg-status-done/60" />
                </div>
                <div className="flex-1 text-center text-[11px] text-muted-foreground font-mono">
                    devflow.app/projects/aurora-mobile
                </div>
            </div>
            {/* board */}
            <div className="grid grid-cols-4 gap-3 p-4 bg-background">
                {cols.map((c, i) => (
                    <div key={c.name} className="min-w-0">
                        <div className="flex items-center gap-2 mb-3 px-1">
                            <span className={`size-2 rounded-full ${c.dot}`} />
                            <span className="text-[11px] font-semibold uppercase tracking-wider">{c.name}</span>
                            <span className="text-[10px] text-muted-foreground ml-auto">{c.count}</span>
                        </div>
                        <div className="space-y-2">
                            {[0, 1, 2].map((j) => (
                                <MiniCard key={j} variant={(i + j + tick) % 4} live={i === 1 && j === 0} />
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
    const priColors = ["bg-priority-urgent", "bg-priority-high", "bg-priority-medium", "bg-priority-low"];
    const avatars = [
        "from-rose-400 to-pink-600",
        "from-amber-400 to-orange-600",
        "from-emerald-400 to-teal-600",
        "from-sky-400 to-indigo-600",
    ];
    return (
        <div
            className={`group rounded-md border bg-card p-2.5 hover:border-primary/40 transition-all cursor-pointer ${live ? "border-primary/60 shadow-[0_0_0_1px_oklch(0.72_0.18_280_/_0.3)]" : "border-border"
                }`}
        >
            <div className="flex items-center gap-1.5 mb-1.5">
                <span className={`size-1.5 rounded-sm ${priColors[variant]}`} />
                <span className="text-[9px] font-mono text-muted-foreground">DEV-{200 + variant * 13}</span>
                {live && (
                    <span className="ml-auto inline-flex items-center gap-1 text-[9px] text-primary font-medium">
                        <span className="size-1 rounded-full bg-primary animate-pulse" />
                        live
                    </span>
                )}
            </div>
            <div className="text-[11px] leading-snug text-foreground/90 line-clamp-2">{titles[variant]}</div>
            <div className="flex items-center justify-between mt-2">
                <div className="flex -space-x-1">
                    <div className={`size-4 rounded-full bg-gradient-to-br ${avatars[variant]} ring-1 ring-card`} />
                    {variant % 2 === 0 && (
                        <div className={`size-4 rounded-full bg-gradient-to-br ${avatars[(variant + 1) % 4]} ring-1 ring-card`} />
                    )}
                </div>
                <span className="text-[9px] text-muted-foreground font-mono">Apr {20 + variant}</span>
            </div>
        </div>
    );
}

/* ---------------- LOGOS ---------------- */

function LogoStrip() {
    const names = ["Vercel", "Linear", "Supabase", "Stripe", "Notion", "Figma"];
    return (
        <section className="py-10 border-y border-border bg-sidebar/40">
            <div className="max-w-5xl mx-auto px-6">
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground text-center mb-6">
                    Trusted by fast-moving teams
                </p>
                <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4 opacity-60">
                    {names.map((n) => (
                        <span key={n} className="text-base font-semibold tracking-tight text-foreground/70">
                            {n}
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
            color: "text-status-progress",
        },
        {
            icon: Layers,
            title: "Kanban that scales",
            desc: "Drag, drop, filter, and group. Built to stay fast at 10 issues or 10,000.",
            color: "text-priority-high",
        },
        {
            icon: MessageSquare,
            title: "Threaded discussions",
            desc: "Nested replies, mentions, and rich comments keep context with the work.",
            color: "text-status-review",
        },
        {
            icon: Lock,
            title: "Role-based access",
            desc: "Admins, members, and viewers — each role sees exactly what they should.",
            color: "text-status-done",
        },
        {
            icon: Bell,
            title: "Smart notifications",
            desc: "Get notified when it matters. Mute when it doesn't. Mark all read in one click.",
            color: "text-priority-urgent",
        },
        {
            icon: Users,
            title: "Workspaces that fit",
            desc: "Multiple workspaces, pending invites, and granular project permissions.",
            color: "text-primary",
        },
    ];

    return (
        <section id="features" className="py-28 px-6">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <p className="text-[11px] uppercase tracking-[0.2em] text-primary font-medium mb-3">Features</p>
                    <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
                        Everything you need.
                        <br />
                        <span className="text-muted-foreground">Nothing you don't.</span>
                    </h2>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-border rounded-xl overflow-hidden border border-border">
                    {features.map((f) => (
                        <div
                            key={f.title}
                            className="bg-background p-7 hover:bg-surface/50 transition-colors group"
                        >
                            <div className={`size-9 rounded-md bg-surface border border-border flex items-center justify-center mb-4 ${f.color} group-hover:scale-110 transition-transform`}>
                                <f.icon className="size-4" strokeWidth={2} />
                            </div>
                            <h3 className="text-sm font-semibold mb-1.5">{f.title}</h3>
                            <p className="text-[13px] text-muted-foreground leading-relaxed">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ---------------- BOARD SHOWCASE ---------------- */

function BoardShowcase() {
    return (
        <section className="py-28 px-6 border-t border-border bg-sidebar/30">
            <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
                <div>
                    <p className="text-[11px] uppercase tracking-[0.2em] text-primary font-medium mb-3">
                        Live collaboration
                    </p>
                    <h2 className="text-3xl md:text-4xl font-semibold tracking-tight leading-tight">
                        See your team move
                        <br />
                        in real time.
                    </h2>
                    <p className="text-base text-muted-foreground mt-5 leading-relaxed">
                        Watch issues drift across the board as your team works. Comments
                        appear as they're typed. Notifications arrive the moment they're
                        triggered. DevFlow keeps everyone on the same page — literally.
                    </p>
                    <ul className="mt-7 space-y-3">
                        {[
                            "Sub-100ms updates over WebSockets",
                            "Live cursors and presence avatars",
                            "Optimistic UI with conflict resolution",
                            "Activity log that captures every change",
                        ].map((item) => (
                            <li key={item} className="flex items-center gap-2.5 text-sm">
                                <span className="size-4 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                                    <Check className="size-2.5 text-primary" strokeWidth={3} />
                                </span>
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="relative">
                    <div className="absolute -inset-6 bg-gradient-to-tr from-primary/20 to-transparent blur-2xl -z-10" />
                    {/* Toast stack */}
                    <div className="rounded-lg border border-border bg-card p-3.5 shadow-2xl mb-3 animate-slide-in-right">
                        <div className="flex items-center gap-2.5">
                            <div className="size-7 rounded-full bg-gradient-to-br from-rose-400 to-pink-600 ring-1 ring-card" />
                            <div className="flex-1 min-w-0">
                                <p className="text-[12px]">
                                    <span className="font-medium">Sarah</span> moved
                                    <span className="text-muted-foreground"> DEV-241 </span>
                                    to <span className="text-status-review font-medium">In Review</span>
                                </p>
                                <p className="text-[10px] text-muted-foreground mt-0.5">just now</p>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-lg border border-border bg-card p-3.5 shadow-xl mb-3 opacity-90">
                        <div className="flex items-center gap-2.5">
                            <div className="size-7 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 ring-1 ring-card" />
                            <div className="flex-1 min-w-0">
                                <p className="text-[12px]">
                                    <span className="font-medium">Marcus</span> commented on
                                    <span className="text-muted-foreground"> DEV-219</span>
                                </p>
                                <p className="text-[10px] text-muted-foreground mt-0.5">2s ago</p>
                            </div>
                        </div>
                    </div>

                    {/* Comment thread */}
                    <div className="rounded-lg border border-border bg-card p-4 shadow-xl mt-5">
                        <div className="flex items-start gap-2.5">
                            <div className="size-7 rounded-full bg-gradient-to-br from-amber-400 to-orange-600 shrink-0" />
                            <div className="flex-1 min-w-0">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-[12px] font-medium">Priya</span>
                                    <span className="text-[10px] text-muted-foreground">2m</span>
                                </div>
                                <p className="text-[12px] text-foreground/80 mt-0.5">
                                    Pushed a fix for the token refresh edge case. Ready for review 🚀
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-2.5 mt-3 pl-6">
                            <div className="size-6 rounded-full bg-gradient-to-br from-sky-400 to-indigo-600 shrink-0" />
                            <div className="flex-1 min-w-0">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-[11px] font-medium">Alex</span>
                                    <span className="text-[10px] text-muted-foreground">just now</span>
                                    <span className="size-1 rounded-full bg-primary animate-pulse ml-1" />
                                </div>
                                <p className="text-[11px] text-foreground/70 mt-0.5">
                                    LGTM, merging now ✅
                                </p>
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
        { n: "01", title: "Create your workspace", desc: "Sign up in seconds. Invite your team by email or share a link." },
        { n: "02", title: "Spin up a project", desc: "Pick a template or start blank. Configure columns to match your flow." },
        { n: "03", title: "Track, discuss, ship", desc: "Drag issues across the board. Comment in threads. Watch your team move in real time." },
    ];
    return (
        <section id="workflow" className="py-28 px-6">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <p className="text-[11px] uppercase tracking-[0.2em] text-primary font-medium mb-3">How it works</p>
                    <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
                        From signup to shipping
                        <br />
                        <span className="text-muted-foreground">in under 5 minutes.</span>
                    </h2>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                    {steps.map((s) => (
                        <div key={s.n} className="relative p-7 rounded-xl border border-border bg-card hover:bg-surface transition-colors">
                            <div className="text-[11px] font-mono text-primary mb-4">{s.n}</div>
                            <h3 className="text-base font-semibold mb-2 tracking-tight">{s.title}</h3>
                            <p className="text-[13px] text-muted-foreground leading-relaxed">{s.desc}</p>
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
            features: ["Up to 10 members", "Unlimited projects", "Real-time updates", "7-day history"],
            cta: "Start free",
            highlight: false,
        },
        {
            name: "Pro",
            price: "$8",
            desc: "Per user / month",
            features: ["Unlimited members", "Advanced filters", "Custom roles", "Unlimited history", "Priority support"],
            cta: "Start 14-day trial",
            highlight: true,
        },
        {
            name: "Enterprise",
            price: "Custom",
            desc: "For organizations at scale",
            features: ["SAML SSO", "Audit logs", "Custom contracts", "Dedicated CSM", "99.99% SLA"],
            cta: "Contact sales",
            highlight: false,
        },
    ];
    return (
        <section id="pricing" className="py-28 px-6 border-t border-border bg-sidebar/30">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <p className="text-[11px] uppercase tracking-[0.2em] text-primary font-medium mb-3">Pricing</p>
                    <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
                        Simple pricing.
                        <br />
                        <span className="text-muted-foreground">Cancel anytime.</span>
                    </h2>
                </div>
                <div className="grid md:grid-cols-3 gap-5">
                    {tiers.map((t) => (
                        <div
                            key={t.name}
                            className={`relative p-7 rounded-xl border transition-all ${t.highlight
                                ? "border-primary/50 bg-card shadow-[0_0_0_1px_oklch(0.72_0.18_280_/_0.3),0_20px_60px_-20px_oklch(0.72_0.18_280_/_0.4)]"
                                : "border-border bg-card hover:border-border/80"
                                }`}
                        >
                            {t.highlight && (
                                <span className="absolute -top-2.5 left-7 px-2 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-semibold uppercase tracking-wider inline-flex items-center">
                                    Most popular
                                </span>
                            )}
                            <h3 className="text-sm font-semibold">{t.name}</h3>
                            <div className="mt-3 flex items-baseline gap-1">
                                <span className="text-3xl font-semibold tracking-tight">{t.price}</span>
                                {t.price !== "Custom" && <span className="text-xs text-muted-foreground">/mo</span>}
                            </div>
                            <p className="text-[12px] text-muted-foreground mt-1">{t.desc}</p>
                            <ul className="mt-6 space-y-2.5">
                                {t.features.map((f) => (
                                    <li key={f} className="flex items-center gap-2 text-[13px]">
                                        <Check className="size-3.5 text-primary shrink-0" strokeWidth={2.5} />
                                        {f}
                                    </li>
                                ))}
                            </ul>
                            <Link
                                to="/signup"
                                className={`mt-7 h-9 w-full rounded-md text-sm font-medium inline-flex items-center justify-center transition-colors ${t.highlight
                                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                                    : "border border-border bg-surface hover:bg-surface-elevated"
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
        <section className="py-28 px-6">
            <div className="max-w-4xl mx-auto relative rounded-2xl border border-border bg-sidebar overflow-hidden p-14 text-center">
                <div
                    className="absolute inset-0 opacity-40"
                    style={{
                        backgroundImage:
                            "radial-gradient(ellipse 60% 80% at 50% 100%, oklch(0.72 0.18 280 / 0.4), transparent 60%)",
                    }}
                />
                <div
                    className="absolute inset-0 opacity-[0.06]"
                    style={{
                        backgroundImage:
                            "linear-gradient(oklch(1 0 0 / 1) 1px, transparent 1px), linear-gradient(90deg, oklch(1 0 0 / 1) 1px, transparent 1px)",
                        backgroundSize: "32px 32px",
                    }}
                />
                <div className="relative">
                    <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
                        Ready to ship faster?
                    </h2>
                    <p className="text-base text-muted-foreground mt-4 max-w-md mx-auto">
                        Join thousands of teams using DevFlow to stay aligned and move quickly.
                    </p>
                    <div className="mt-8 flex items-center justify-center gap-3">
                        <Link
                            to="/signup"
                            className="h-10 px-5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 inline-flex items-center gap-2 transition-colors"
                        >
                            Get started free
                            <ArrowRight className="size-4" />
                        </Link>
                        <Link
                            to="/app"
                            className="h-10 px-5 rounded-md border border-border bg-card/60 backdrop-blur text-sm font-medium hover:bg-surface inline-flex items-center transition-colors"
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
        <footer className="border-t border-border py-10 px-6">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <div className="size-6 rounded bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                        <CircleDot className="size-3.5 text-primary-foreground" strokeWidth={2.5} />
                    </div>
                    <span className="text-xs font-semibold tracking-tight">DevFlow</span>
                    <span className="text-xs text-muted-foreground ml-2">© 2026</span>
                </div>
                <div className="flex items-center gap-5 text-[12px] text-muted-foreground">
                    <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
                    <a href="#" className="hover:text-foreground transition-colors">Terms</a>
                    <a href="#" className="hover:text-foreground transition-colors">Status</a>
                </div>
            </div>
        </footer>
    );
}
