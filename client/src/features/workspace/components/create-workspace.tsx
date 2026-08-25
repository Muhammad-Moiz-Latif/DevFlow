import { useState } from "react";
import {
    Building2,
    ArrowRight,
    Sparkles,
    ArrowLeft,
    Link2,
} from "lucide-react";
import { useNavigate } from "react-router";
import { useCreateWorkspace } from "../query/useCreateWorkspace";
import {
    errorToast,
    successToast,
} from "../../../components/ui/CustomToasts";
import { GeneralLoader } from "../../../utils/loader";
import logo from '@/assets/logo.png';

export function CreateWorkspace() {
    const [name, setName] = useState("");
    const [slug, setSlug] = useState("");

    const { mutate, isPending } = useCreateWorkspace();
    const navigate = useNavigate();

    const handleNameChange = (v: string) => {
        setName(v);

        setSlug(
            v
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-|-$/g, "")
        );
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!slug) return;

        mutate(name, {
            onSuccess: () => {
                successToast("Workspace created!");

                setTimeout(() => {
                    navigate(`/w/${slug}`);
                }, 1000);
            },

            onError: () =>
                errorToast("Could not create workspace"),
        });
    };

    if (isPending) {
        return (
            <GeneralLoader label="Creating your workspace" />
        );
    }

    return (
        <div className="relative min-h-screen overflow-hidden bg-background text-foreground">

            {/* =========================================================
                ATMOSPHERE
            ========================================================== */}

            <div className="pointer-events-none absolute inset-0">

                {/* subtle radial light */}
                <div
                    className="absolute -left-32 -top-32 size-[520px] opacity-[0.08]"
                    style={{
                        background:
                            "radial-gradient(circle, oklch(0.65 0.18 80), transparent 68%)",
                    }}
                />

                <div
                    className="absolute -bottom-48 -right-32 size-[520px] opacity-[0.045]"
                    style={{
                        background:
                            "radial-gradient(circle, oklch(0.65 0.18 80), transparent 68%)",
                    }}
                />

                {/* technical grid */}
                <div
                    className="absolute inset-0 opacity-[0.018]"
                    style={{
                        backgroundImage: `
                            linear-gradient(
                                to right,
                                currentColor 1px,
                                transparent 1px
                            ),
                            linear-gradient(
                                to bottom,
                                currentColor 1px,
                                transparent 1px
                            )
                        `,
                        backgroundSize: "42px 42px",
                    }}
                />
            </div>


            {/* =========================================================
                TOP NAV
            ========================================================== */}

            <header className="relative z-10 border-b border-border/50">

                <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:px-8">

                    {/* Brand with logo */}
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="group flex items-center gap-3"
                    >
                        <div className="relative flex size-8 items-center justify-center transition-transform duration-200 group-hover:scale-105">
                            <img
                                src={logo}
                                alt="DevFlow logo"
                                className="size-8 object-contain"
                            />
                            {/* registration mark */}
                            <span className="absolute -left-px -top-px size-1.5 border-l border-t border-primary/70" />
                        </div>

                        <div className="flex flex-col items-start">
                            <span className="text-[13px] font-semibold tracking-[-0.02em] text-slate-100 flex items-baseline gap-[1px]">
                                Dev<span className="font-mono text-[11px] font-medium text-primary">FLOW</span>
                            </span>

                            <span className="text-[8px] font-mono uppercase tracking-[0.14em] text-muted-foreground/40">
                                Workspace
                            </span>
                        </div>
                    </button>


                    {/* Back */}
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="
                            group
                            inline-flex
                            items-center
                            gap-2
                            text-[10px]
                            font-mono
                            uppercase
                            tracking-[0.12em]
                            text-muted-foreground/50
                            transition-colors
                            hover:text-foreground
                        "
                    >
                        <ArrowLeft
                            className="size-3.5 transition-transform group-hover:-translate-x-0.5"
                            strokeWidth={1.7}
                        />

                        Back
                    </button>
                </div>
            </header>


            {/* =========================================================
                MAIN
            ========================================================== */}

            <main className="relative z-10 mx-auto flex w-full max-w-6xl px-5 py-14 md:px-8 md:py-20">

                <div className="grid w-full grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_480px] lg:items-center">


                    {/* =================================================
                        LEFT — EDITORIAL INTRO
                    ================================================== */}

                    <section className="max-w-xl">

                        <div className="mb-6 flex items-center gap-3 text-[9px] font-mono uppercase tracking-[0.2em] text-muted-foreground/45">

                            <span className="h-px w-6 bg-primary/60" />

                            Workspace setup

                            <span className="h-px w-6 bg-border" />

                            01 / 01
                        </div>


                        <div className="mb-6 inline-flex items-center gap-2 border border-primary/20 bg-primary/[0.045] px-2.5 py-1.5">

                            <Sparkles
                                className="size-3 text-primary/80"
                                strokeWidth={1.7}
                            />

                            <span className="text-[9px] font-mono uppercase tracking-[0.14em] text-primary/75">
                                Welcome to DevFlow
                            </span>
                        </div>


                        <h1 className="max-w-lg text-[2.7rem] font-semibold leading-[0.98] tracking-[-0.055em] md:text-[3.5rem]">

                            Give your team
                            <br />

                            <span className="text-muted-foreground/65">
                                somewhere to build.
                            </span>
                        </h1>


                        <p className="mt-6 max-w-md text-[13.5px] leading-7 text-muted-foreground/65">
                            Create a workspace where your team can
                            organize issues, projects, discussions, and
                            everything in between.
                        </p>


                        {/* Small technical metadata */}
                        <div className="mt-10 grid max-w-md grid-cols-2 border-y border-border/50">

                            <div className="border-r border-border/50 py-4 pr-5">

                                <p className="text-[9px] font-mono uppercase tracking-[0.15em] text-muted-foreground/35">
                                    Environment
                                </p>

                                <p className="mt-1.5 text-[11px] font-medium">
                                    Private workspace
                                </p>
                            </div>


                            <div className="py-4 pl-5">

                                <p className="text-[9px] font-mono uppercase tracking-[0.15em] text-muted-foreground/35">
                                    Access
                                </p>

                                <p className="mt-1.5 text-[11px] font-medium">
                                    Team controlled
                                </p>
                            </div>
                        </div>
                    </section>


                    {/* =================================================
                        RIGHT — CREATE FORM
                    ================================================== */}

                    <section className="relative">

                        {/* Corner marks */}
                        <div className="absolute -left-2 -top-2 size-4 border-l border-t border-primary/35" />
                        <div className="absolute -right-2 -top-2 size-4 border-r border-t border-primary/35" />
                        <div className="absolute -bottom-2 -left-2 size-4 border-b border-l border-primary/35" />
                        <div className="absolute -bottom-2 -right-2 size-4 border-b border-r border-primary/35" />


                        <form
                            onSubmit={submit}
                            className="relative overflow-hidden border border-border/70 bg-card"
                        >

                            {/* top line */}
                            <div className="h-px w-full bg-linear-to-r from-primary/60 via-primary/20 to-transparent" />


                            {/* Form header */}
                            <div className="border-b border-border/60 px-6 py-5 md:px-7">

                                <div className="flex items-start justify-between gap-4">

                                    <div className="flex items-center gap-3">

                                        <div className="flex size-9 items-center justify-center border border-primary/20 bg-primary/[0.06]">

                                            <Building2
                                                className="size-4 text-primary/80"
                                                strokeWidth={1.6}
                                            />
                                        </div>

                                        <div>
                                            <p className="text-[13px] font-semibold tracking-[-0.015em]">
                                                New workspace
                                            </p>

                                            <p className="mt-0.5 text-[10px] text-muted-foreground/50">
                                                Configure your team environment
                                            </p>
                                        </div>
                                    </div>


                                    <span className="font-mono text-[9px] tracking-[0.14em] text-muted-foreground/60">
                                        SETUP
                                    </span>
                                </div>
                            </div>


                            {/* Form body */}
                            <div className="space-y-6 px-6 py-7 md:px-7">

                                {/* Workspace name */}
                                <div>

                                    <div className="mb-2 flex items-center justify-between">

                                        <label
                                            htmlFor="workspace-name"
                                            className="text-[10px] font-mono uppercase tracking-[0.14em] text-muted-foreground/55"
                                        >
                                            Workspace name
                                        </label>

                                        <span className="text-[9px] font-mono text-muted-foreground/60">
                                            REQUIRED
                                        </span>
                                    </div>


                                    <input
                                        id="workspace-name"
                                        value={name}
                                        onChange={(e) =>
                                            handleNameChange(
                                                e.target.value
                                            )
                                        }
                                        placeholder="Acme Corp"
                                        autoComplete="organization"
                                        className="
                                            h-11
                                            w-full
                                            border
                                            border-border/70
                                            bg-background/60
                                            px-3.5
                                            text-[13px]
                                            placeholder:text-muted-foreground/30
                                            transition-all
                                            hover:border-border
                                            focus:border-primary/50
                                            focus:bg-background
                                            focus:outline-none
                                            focus:ring-2
                                            focus:ring-primary/10
                                        "
                                    />

                                    <p className="mt-2 text-[10px] leading-relaxed text-muted-foreground/35">
                                        Choose the name your team will recognize.
                                    </p>
                                </div>


                                {/* Workspace URL */}
                                <div>

                                    <div className="mb-2 flex items-center justify-between">

                                        <label
                                            htmlFor="workspace-slug"
                                            className="text-[10px] font-mono uppercase tracking-[0.14em] text-muted-foreground/55"
                                        >
                                            Workspace URL
                                        </label>

                                        <Link2
                                            className="size-3 text-muted-foreground/60"
                                            strokeWidth={1.7}
                                        />
                                    </div>


                                    <div className="flex h-11 border border-border/70 bg-background/60 transition-all focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/10">

                                        <span className="flex shrink-0 items-center border-r border-border/60 bg-sidebar/30 px-3 text-[10px] font-mono text-muted-foreground/45">
                                            devflow.app/w/
                                        </span>

                                        <input
                                            id="workspace-slug"
                                            value={slug}
                                            onChange={(e) =>
                                                setSlug(
                                                    e.target.value
                                                        .toLowerCase()
                                                        .replace(
                                                            /[^a-z0-9-]/g,
                                                            ""
                                                        )
                                                )
                                            }
                                            placeholder="acme"
                                            autoComplete="off"
                                            className="
                                                min-w-0
                                                flex-1
                                                bg-transparent
                                                px-3
                                                text-[12px]
                                                font-mono
                                                text-foreground
                                                placeholder:text-muted-foreground/25
                                                focus:outline-none
                                            "
                                        />
                                    </div>

                                    <p className="mt-2 text-[10px] leading-relaxed text-muted-foreground/35">
                                        This becomes your workspace's unique address.
                                    </p>
                                </div>


                                {/* Preview */}
                                <div className="border border-border/50 bg-sidebar/20">

                                    <div className="flex items-center justify-between border-b border-border/40 px-3 py-2">

                                        <span className="text-[8px] font-mono uppercase tracking-[0.16em] text-muted-foreground/60">
                                            URL preview
                                        </span>

                                        <span className="size-1 bg-primary/50" />
                                    </div>

                                    <div className="px-3 py-3">

                                        <p className="truncate text-[11px] font-mono text-muted-foreground/55">
                                            <span className="text-muted-foreground/30">
                                                devflow.app/w/
                                            </span>

                                            <span className="text-foreground/75">
                                                {slug || "your-workspace"}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </div>


                            {/* Form footer */}
                            <div className="border-t border-border/60 bg-sidebar/20 px-6 py-4 md:px-7">

                                <button
                                    type="submit"
                                    disabled={!slug}
                                    className="
                                        group
                                        flex
                                        h-11
                                        w-full
                                        items-center
                                        justify-center
                                        gap-2
                                        bg-primary
                                        text-[12px]
                                        font-medium
                                        text-primary-foreground
                                        transition-all
                                        hover:bg-primary/90
                                        hover:gap-2.5
                                        disabled:cursor-not-allowed
                                        disabled:opacity-35
                                    "
                                >
                                    Create workspace

                                    <ArrowRight
                                        className="size-3.5 transition-transform group-hover:translate-x-0.5"
                                        strokeWidth={1.8}
                                    />
                                </button>

                                <p className="mt-3 text-center text-[9px] font-mono uppercase tracking-[0.12em] text-muted-foreground/60">
                                    Your workspace can be configured later
                                </p>
                            </div>
                        </form>
                    </section>
                </div>
            </main>


            {/* =========================================================
                FOOTER
            ========================================================== */}

            <footer className="relative z-10 mx-auto flex max-w-6xl items-center justify-between border-t border-border/40 px-5 py-4 text-[8px] font-mono uppercase tracking-[0.16em] text-muted-foreground/60 md:px-8">

                <span>DevFlow</span>

                <div className="flex items-center gap-3">
                    <span>Workspace initialization</span>
                    <span className="size-1 bg-primary/40" />
                    <span>01</span>
                </div>
            </footer>
        </div>
    );
}