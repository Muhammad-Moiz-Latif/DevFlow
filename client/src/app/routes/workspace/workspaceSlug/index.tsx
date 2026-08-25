import {
    Activity,
    ArrowRight,
    CheckCircle2,
    Clock3,
    Command,
    Layers3,
    Loader2,
    Zap,
} from "lucide-react";
import { Link, useParams } from "react-router";
import { useMemo } from "react";

import { PriorityBadge, StatusBadge } from "../../../../components/ui/badges";
import { useMyIssues } from "../../../../features/workspace/query/useMyIssues";
import { useCurrentWorkspace } from "../../../../features/workspace/query/useCurrentWorkspace";
import { useAuthStore } from "../../../../stores/auth-store";
import { useAllActivityLogs } from "../../../../features/workspace/query/useAllActivityLogs";

type Priority = "urgent" | "high" | "medium" | "low";
type Status = "todo" | "progress" | "review" | "done";

/* -------------------------------------------------------------------------- */
/* HELPERS                                                                    */
/* -------------------------------------------------------------------------- */

const mapPriority = (priority: string): Priority => {
    const map: Record<string, Priority> = {
        URGENT: "urgent",
        HIGH: "high",
        MEDIUM: "medium",
        LOW: "low",
    };

    return map[priority] || "low";
};

const mapStatus = (status: string): Status => {
    const map: Record<string, Status> = {
        TODO: "todo",
        IN_PROGRESS: "progress",
        IN_REVIEW: "review",
        DONE: "done",
    };

    return map[status] || "todo";
};

const formatDate = (date: Date | string | null | undefined): string => {
    if (!date) return "—";

    const d = new Date(date);

    if (Number.isNaN(d.getTime())) {
        return "—";
    }

    return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
    });
};

const formatTimeAgo = (date: Date | string): string => {
    const d = new Date(date);

    const now = new Date();

    const diffMs = now.getTime() - d.getTime();

    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return "Yesterday";

    return `${diffDays}d ago`;
};

const getActivityMessage = (log: any): string => {
    const { logType, newValue } = log;

    switch (logType) {
        case "STATUS_CHANGED":
            return `changed status to ${newValue}`;

        case "PRIORITY_CHANGED":
            return `changed priority to ${newValue}`;

        case "ASSIGNEE_CHANGED":
            return "reassigned issue";

        case "COMMENT_ADDED":
            return "commented on issue";

        case "COMMENT_DELETED":
            return "deleted a comment";

        case "ISSUE_CREATED":
            return "created issue";

        default:
            return "updated issue";
    }
};

/* -------------------------------------------------------------------------- */
/* DASHBOARD                                                                  */
/* -------------------------------------------------------------------------- */

export function Dashboard() {
    const { user } = useAuthStore();

    const { workspaceSlug } = useParams();

    const {
        data: workspaceData,
        isPending: isWorkspacePending,
    } = useCurrentWorkspace(workspaceSlug!);

    const {
        data: allIssues,
        isPending: isIssuesPending,
    } = useMyIssues(
        user?._id!,
        workspaceData?.data?.id!
    );

    const {
        data: allActivityLogs,
        isPending: isActivityPending,
    } = useAllActivityLogs(
        workspaceData?.data?.id!
    );

    /* ---------------------------------------------------------------------- */
    /* METRICS                                                                */
    /* ---------------------------------------------------------------------- */

    const metrics = useMemo(() => {
        const issues = allIssues?.data ?? [];

        const total = issues.length;

        const completed = issues.filter(
            (issue) => issue.status === "DONE"
        ).length;

        const urgent = issues.filter(
            (issue) => issue.priority === "URGENT"
        ).length;

        const inProgress = issues.filter(
            (issue) => issue.status === "IN_PROGRESS"
        ).length;

        const inReview = issues.filter(
            (issue) => issue.status === "IN_REVIEW"
        ).length;

        const todo = issues.filter(
            (issue) => issue.status === "TODO"
        ).length;

        const completionRate =
            total > 0
                ? Math.round((completed / total) * 100)
                : 0;

        return {
            total,
            completed,
            urgent,
            inProgress,
            inReview,
            todo,
            completionRate,
        };
    }, [allIssues?.data]);

    /* ---------------------------------------------------------------------- */
    /* LOADING                                                                 */
    /* ---------------------------------------------------------------------- */

    if (
        !user ||
        isWorkspacePending ||
        !workspaceData?.data
    ) {
        return <DashboardLoader />;
    }

    const hour = new Date().getHours();

    const greeting =
        hour < 12
            ? "morning"
            : hour < 17
                ? "afternoon"
                : "evening";

    const workspaceName =
        workspaceData.data.name || "Workspace";

    // Get top 5 issues and activities
    const topIssues = allIssues?.data?.slice(0, 5) ?? [];
    const topActivities = allActivityLogs?.data
        ? [...allActivityLogs.data]
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 5)
        : [];
    return (
        <div className="relative min-h-full overflow-hidden">
            {/* -----------------------BACKGROUND----------------------------------------- */}

            <DashboardAtmosphere />

            {/* -----------------------------CONTENT----------------------------------- */}


            <main className="relative z-10 max-w-[1400px] mx-auto px-4 py-5 md:px-6 md:py-7">

                {/* ==========================HEADER================================== */}


                <section className="relative mb-8">

                    {/* registration marks with spacing */}

                    <CornerMark position="top-left" />
                    <CornerMark position="top-right" />

                    <div className="border-b border-border/70 pb-5 pt-2">

                        {/* technical identity */}

                        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 my-4">

                            <TechnicalLabel>
                                FIG. 10
                            </TechnicalLabel>

                            <span className="w-4 h-px bg-border" />

                            <TechnicalLabel>
                                WORKSPACE CONTROL
                            </TechnicalLabel>

                            <span className="w-px h-3 bg-border/60" />

                            <TechnicalLabel>
                                {formatDate(new Date())}
                            </TechnicalLabel>

                            <span className="w-px h-3 bg-border/60" />

                            <span className="inline-flex items-center gap-1.5 text-[9px] font-mono tracking-[0.12em] text-primary/75 uppercase">

                                <span className="size-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_8px_oklch(0.72_0.20_290/0.55)]" />

                                SYSTEM / LIVE

                            </span>

                            <div className="ml-auto hidden md:flex items-center gap-2">

                                <span className="text-[8px] font-mono tracking-[0.15em] text-muted-foreground/35 uppercase">
                                    REV / 02
                                </span>

                                <span className="w-1 h-1 rounded-full bg-border" />

                                <span className="text-[8px] font-mono tracking-[0.15em] text-muted-foreground/35 uppercase">
                                    SCALE / 1:1
                                </span>

                            </div>
                        </div>

                        {/* main heading */}

                        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">

                            <div>

                                <h1 className="text-[1.75rem] md:text-[2.15rem] font-semibold tracking-[-0.045em] leading-none">

                                    Good {greeting},{" "}

                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary to-primary/55">
                                        {user.username}
                                    </span>

                                </h1>

                                <p className="mt-2.5 text-[13px] text-muted-foreground max-w-xl leading-relaxed">

                                    Your workspace is operational.
                                    You have{" "}

                                    <span className="text-foreground font-medium">
                                        {metrics.total}{" "}
                                        {metrics.total === 1
                                            ? "assigned issue"
                                            : "assigned issues"}
                                    </span>

                                    {metrics.urgent > 0 && (
                                        <>
                                            {" "}with{" "}

                                            <span className="text-priority-urgent font-medium">
                                                {metrics.urgent} urgent
                                            </span>
                                        </>
                                    )}

                                    .

                                </p>

                            </div>

                            {/* workspace identity */}

                            <div className="flex items-center gap-3 shrink-0">

                                <div className="size-9 border border-border bg-card flex items-center justify-center">

                                    <Command
                                        className="size-4 text-primary/75"
                                        strokeWidth={1.5}
                                    />

                                </div>

                                <div>

                                    <div className="text-[9px] font-mono tracking-[0.14em] text-muted-foreground/45 uppercase">
                                        ACTIVE SURFACE
                                    </div>

                                    <div className="mt-0.5 text-[12px] font-medium text-foreground/85">
                                        {workspaceName}
                                    </div>

                                </div>

                            </div>

                        </div>

                        {/* workload scale */}

                        <WorkloadScale
                            total={metrics.total}
                            completed={metrics.completed}
                        />

                    </div>
                </section>

                {/* ===========================INSTRUMENT STRIP================================= */}


                <section className="mb-6">

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border border border-border">

                        <InstrumentCell
                            icon={Layers3}
                            label="Assigned"
                            value={metrics.total}
                            meta="ISSUES"
                        />

                        <InstrumentCell
                            icon={Zap}
                            label="Urgent"
                            value={metrics.urgent}
                            meta="ATTENTION"
                            tone="urgent"
                        />

                        <InstrumentCell
                            icon={Activity}
                            label="In progress"
                            value={metrics.inProgress}
                            meta="ACTIVE"
                            tone="progress"
                        />

                        <InstrumentCell
                            icon={CheckCircle2}
                            label="Completed"
                            value={metrics.completed}
                            meta="CLOSED"
                            tone="done"
                        />

                    </div>

                </section>

                {/* ==========================MAIN OPERATIONAL SURFACE================================== */}


                <section className="grid grid-cols-1 xl:grid-cols-[1.55fr_1fr] gap-4">

                    {/* --------------------------ASSIGNED WORK ------------------------------ */}


                    <Panel
                        figure="FIG. 11"
                        label="Assigned Work"
                        count={metrics.total}
                        action={
                            metrics.total > 5 ? (
                                <Link
                                    to={`/w/${workspaceSlug}/my-issues`}
                                    className="group inline-flex items-center gap-1.5 text-[10px] font-mono tracking-[0.08em] uppercase text-primary/65 hover:text-primary transition-colors"
                                >
                                    View all

                                    <ArrowRight
                                        className="size-3 transition-transform group-hover:translate-x-0.5"
                                        strokeWidth={1.7}
                                    />
                                </Link>
                            ) : null
                        }
                    >

                        <div className="divide-y divide-border/70">

                            {isIssuesPending ? (
                                <PanelLoader label="Loading assigned work…" />
                            ) : topIssues.length > 0 ? (

                                topIssues.map((issue, index) => (

                                    <IssueRow
                                        key={issue.id}
                                        issue={issue}
                                        index={index}
                                    />

                                ))

                            ) : (

                                <EmptyState
                                    icon={CheckCircle2}
                                    title="No assigned work"
                                    subtitle="The surface is clear."
                                />

                            )}

                        </div>

                        {/* panel footer */}

                        <PanelFooter
                            left="ISSUE STREAM"
                            right={`${Math.min(topIssues.length, 5)} / ${metrics.total || 0}`}
                        />

                    </Panel>

                    {/* ------------------------LIVE ACTIVITY -------------------------------- */}


                    <Panel
                        figure="FIG. 12"
                        label="Activity Stream"
                        count={allActivityLogs?.data?.length ?? 0}
                        status
                    >

                        <div className="divide-y divide-border/70">

                            {isActivityPending ? (
                                <PanelLoader label="Listening for activity…" />
                            ) : topActivities.length > 0 ? (

                                topActivities.map((log, index) => (

                                    <ActivityRow
                                        key={`${log.id}-${index}`}
                                        log={log}
                                        live={index === 0}
                                    />

                                ))

                            ) : (

                                <EmptyState
                                    icon={Clock3}
                                    title="No activity yet"
                                    subtitle="Waiting for workspace events."
                                />

                            )}

                        </div>

                        <PanelFooter
                            left="STREAM"
                            right="ACTIVE"
                        />

                    </Panel>

                </section>

                {/* =========================TECHNICAL FOOTER  =================================== */}


                <footer className="mt-7 pt-3 border-t border-border/50 flex flex-wrap items-center justify-between gap-3">

                    <div className="flex items-center gap-2.5 text-[8px] font-mono tracking-[0.14em] text-muted-foreground/30 uppercase">

                        <span>
                            SHEET 01 / 01
                        </span>

                        <span className="w-px h-2 bg-border/40" />

                        <span>
                            DEVFLOW / CORE SURFACE
                        </span>

                    </div>

                    <div className="flex items-center gap-2.5 text-[8px] font-mono tracking-[0.14em] text-muted-foreground/30 uppercase">

                        <span>
                            WORKSPACE / {workspaceSlug}
                        </span>

                        <span className="w-px h-2 bg-border/40" />

                        <span>
                            REV. 02
                        </span>

                        <span className="w-px h-2 bg-border/40" />

                        <span className="text-primary/45">
                            SYSTEM / READY
                        </span>

                    </div>

                </footer>

            </main>
        </div>
    );
}

/* ========================================================================= */
/* BACKGROUND                                                                */
/* ========================================================================= */

function DashboardAtmosphere() {
    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">

            {/* drafting grid */}

            <div
                className="absolute inset-0 opacity-[0.028]"
                style={{
                    backgroundImage: `
                        linear-gradient(oklch(1 0 0 / 1) 1px, transparent 1px),
                        linear-gradient(90deg, oklch(1 0 0 / 1) 1px, transparent 1px)
                    `,
                    backgroundSize: "40px 40px",
                }}
            />

            {/* central atmospheric glow */}

            <div
                className="
                    absolute
                    left-[58%]
                    top-[18%]
                    -translate-x-1/2
                    w-[650px]
                    h-[420px]
                    rounded-full
                    bg-primary/[0.035]
                    blur-[120px]
                "
            />

            {/* secondary glow */}

            <div
                className="
                    absolute
                    right-[-200px]
                    top-[45%]
                    size-[400px]
                    rounded-full
                    bg-primary/[0.018]
                    blur-[100px]
                "
            />

            {/* horizontal signal */}

            <div
                className="
                    absolute
                    left-0
                    top-[30%]
                    w-32
                    h-px
                    bg-gradient-to-r
                    from-transparent
                    via-primary/20
                    to-transparent
                    animate-pulse
                "
            />

        </div>
    );
}

/* ========================================================================= */
/* CORNER MARK                                                               */
/* ========================================================================= */

function CornerMark({
    position,
}: {
    position: "top-left" | "top-right";
}) {
    return (
        <div
            className={`
                absolute
                top-0
                ${position === "top-left" ? "left-0" : "right-0"}
                size-3
                border-primary/35
                ${position === "top-left"
                    ? "border-t border-l"
                    : "border-t border-r"
                }
                pointer-events-none
            `}
        />
    );
}

/* ========================================================================= */
/* TECHNICAL LABEL                                                           */
/* ========================================================================= */

function TechnicalLabel({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <span className="text-[9px] font-mono tracking-[0.16em] text-muted-foreground/50 uppercase">
            {children}
        </span>
    );
}

/* ========================================================================= */
/* WORKLOAD SCALE                                                            */
/* ========================================================================= */

function WorkloadScale({
    total,
    completed,
}: {
    total: number;
    completed: number;
}) {
    const length = Math.min(Math.max(total, 1), 32);

    return (
        <div className="mt-5 flex items-center gap-3">

            <div className="flex items-end gap-[3px] h-3">

                {Array.from({ length }).map((_, index) => {

                    const filled =
                        index < Math.min(completed, length);

                    return (
                        <span
                            key={index}
                            className={
                                filled
                                    ? "bg-status-done"
                                    : "bg-border/70"
                            }
                            style={{
                                width: "2px",
                                height:
                                    index % 5 === 0
                                        ? "12px"
                                        : index % 2 === 0
                                            ? "7px"
                                            : "4px",
                            }}
                        />
                    );
                })}

            </div>

            <span className="text-[8px] font-mono tracking-[0.13em] text-muted-foreground/35 uppercase">
                Workload rail · {completed}/{total} closed
            </span>

            <div className="hidden sm:flex items-center gap-[3px] ml-auto">

                {Array.from({ length: 13 }).map((_, index) => (
                    <span
                        key={index}
                        className={
                            index % 5 === 0
                                ? "w-px h-3 bg-primary/35"
                                : "w-px h-1.5 bg-border/50"
                        }
                    />
                ))}

                <span className="ml-2 text-[8px] font-mono tracking-[0.12em] text-muted-foreground/30 uppercase">
                    SCALE 1:1
                </span>

            </div>

        </div>
    );
}

/* ========================================================================= */
/* INSTRUMENT CELL                                                           */
/* ========================================================================= */

function InstrumentCell({
    icon: Icon,
    label,
    value,
    meta,
    tone = "primary",
}: {
    icon: React.ElementType;
    label: string;
    value: number;
    meta: string;
    tone?: "primary" | "urgent" | "progress" | "done";
}) {
    const toneClass = {
        primary: "text-primary",
        urgent: "text-priority-urgent",
        progress: "text-status-progress",
        done: "text-status-done",
    }[tone];

    return (
        <div className="bg-background px-4 py-3.5 hover:bg-surface/25 transition-colors">

            <div className="flex items-center justify-between mb-2">

                <span className="text-[9px] font-mono tracking-[0.12em] text-muted-foreground/45 uppercase">
                    {label}
                </span>

                <Icon
                    className={`size-3 ${toneClass} opacity-60`}
                    strokeWidth={1.6}
                />

            </div>

            <div className="flex items-end justify-between">

                <span
                    className={`text-[1.5rem] leading-none font-semibold tracking-[-0.03em] tabular-nums ${toneClass}`}
                >
                    {value}
                </span>

                <span className="text-[8px] font-mono tracking-[0.12em] text-muted-foreground/30 uppercase">
                    {meta}
                </span>

            </div>

        </div>
    );
}

/* ========================================================================= */
/* PANEL                                                                     */
/* ========================================================================= */

function Panel({
    figure,
    label,
    count,
    status,
    action,
    children,
}: {
    figure: string;
    label: string;
    count: number;
    status?: boolean;
    action?: React.ReactNode;
    children: React.ReactNode;
}) {
    return (
        <div className="relative border border-border bg-card overflow-hidden flex flex-col">

            <div className="absolute top-0 left-0 size-2 border-t border-l border-primary/30 pointer-events-none" />

            <div className="absolute top-0 right-0 size-2 border-t border-r border-primary/30 pointer-events-none" />

            {/* header */}
            <div className="h-10 border-b border-border bg-sidebar/35 px-3.5 flex items-center gap-2.5 shrink-0">

                <span className="text-[8px] font-mono tracking-[0.14em] text-muted-foreground/35">
                    {figure}
                </span>

                <span className="w-3 h-px bg-border" />

                <span className="text-[10px] font-mono tracking-[0.08em] text-foreground/70 uppercase">
                    {label}
                </span>

                <span className="text-[9px] font-mono text-muted-foreground/35">
                    {String(count).padStart(2, "0")}
                </span>

                {status && (
                    <span className="ml-auto flex items-center gap-1.5 text-[8px] font-mono tracking-[0.1em] text-primary/65 uppercase">

                        <span className="size-1 rounded-full bg-primary animate-pulse" />

                        LIVE

                    </span>
                )}

                {action && (
                    <div className="ml-auto">
                        {action}
                    </div>
                )}

            </div>

            <div className="flex-1">
                {children}
            </div>

        </div>
    );
}

/* ========================================================================= */
/* ISSUE ROW                                                                 */
/* ========================================================================= */

function IssueRow({
    issue,
    index,
}: {
    issue: any;
    index: number;
}) {
    return (
        <div className="group flex items-center gap-3 px-3.5 py-3 hover:bg-surface/30 transition-colors h-[52px]">

            {/* sequence */}

            <span className="hidden sm:block w-5 text-[8px] font-mono text-muted-foreground/25 tabular-nums">
                {String(index + 1).padStart(2, "0")}
            </span>

            {/* priority */}

            <PriorityBadge
                priority={mapPriority(issue.priority)}
                compact
            />

            {/* issue id */}

            <span className="hidden md:block w-16 shrink-0 text-[9px] font-mono tracking-wide text-muted-foreground/45">
                {issue.id.slice(0, 8).toUpperCase()}
            </span>

            {/* title */}

            <span className="flex-1 min-w-0 truncate text-[12px] md:text-[13px] text-foreground/80 group-hover:text-foreground transition-colors">
                {issue.title}
            </span>

            {/* status */}

            <StatusBadge
                status={mapStatus(issue.status)}
            />

            {/* due date */}

            <span className="hidden sm:block w-12 text-right text-[9px] font-mono text-muted-foreground/40 tabular-nums">
                {formatDate(issue.dueDate)}
            </span>

            {/* arrow */}

            <ArrowRight
                className="size-3 text-muted-foreground/20 group-hover:text-primary/60 group-hover:translate-x-0.5 transition-all"
                strokeWidth={1.5}
            />

        </div>
    );
}

/* ========================================================================= */
/* ACTIVITY ROW                                                              */
/* ========================================================================= */

function ActivityRow({
    log,
    live,
}: {
    log: any;
    live: boolean;
}) {
    return (
        <div
            className={`
                flex gap-2.5 px-3.5 py-3
                transition-colors h-[52px] items-center
                ${live
                    ? "bg-primary/[0.035]"
                    : "hover:bg-surface/25"
                }
            `}
        >

            {/* actor */}

            <div className="size-7 shrink-0 border border-border bg-background flex items-center justify-center">

                <span className="text-[8px] font-mono text-muted-foreground/65">
                    {log.actor.username
                        .slice(0, 2)
                        .toUpperCase()}
                </span>

            </div>

            {/* event */}

            <div className="min-w-0 flex-1">

                <div className="flex items-center gap-2">

                    <p className="text-[11.5px] leading-snug text-foreground/80 truncate">

                        <span className="font-medium text-foreground/90">
                            {log.actor.username}
                        </span>{" "}

                        <span className="text-muted-foreground/65">
                            {getActivityMessage(log)}
                        </span>

                    </p>

                    {live && (
                        <span className="shrink-0 size-1.5 rounded-full bg-primary animate-pulse" />
                    )}

                </div>

                <div className="flex items-center gap-2 mt-0.5">

                    <span className="text-[8.5px] font-mono tracking-wide text-muted-foreground/40">
                        {formatTimeAgo(log.createdAt)}
                    </span>

                    {live && (
                        <>
                            <span className="w-px h-2 bg-primary/25" />

                            <span className="text-[8px] font-mono tracking-[0.1em] text-primary/55 uppercase">
                                Live
                            </span>
                        </>
                    )}

                </div>

            </div>

        </div>
    );
}

/* ========================================================================= */
/* PANEL FOOTER                                                              */
/* ========================================================================= */

function PanelFooter({
    left,
    right,
}: {
    left: string;
    right: string;
}) {
    return (
        <div className="h-8 border-t border-border bg-sidebar/30 px-3.5 flex items-center justify-between shrink-0">

            <span className="text-[8px] font-mono tracking-[0.12em] text-muted-foreground/30 uppercase">
                {left}
            </span>

            <span className="text-[8px] font-mono tracking-[0.1em] text-muted-foreground/30">
                {right}
            </span>

        </div>
    );
}

/* ========================================================================= */
/* EMPTY STATE                                                               */
/* ========================================================================= */

function EmptyState({
    icon: Icon,
    title,
    subtitle,
}: {
    icon: React.ElementType;
    title: string;
    subtitle: string;
}) {
    return (
        <div className="flex flex-col items-center justify-center py-16 h-[260px]">

            <Icon
                className="size-6 text-muted-foreground/20 mb-2"
                strokeWidth={1.4}
            />

            <p className="text-[12px] text-muted-foreground/55">
                {title}
            </p>

            <p className="mt-1 text-[8px] font-mono tracking-[0.1em] text-muted-foreground/30 uppercase">
                {subtitle}
            </p>

        </div>
    );
}

/* ========================================================================= */
/* LOADING                                                                   */
/* ========================================================================= */

function PanelLoader({
    label,
}: {
    label: string;
}) {
    return (
        <div className="flex items-center justify-center py-16 gap-2.5 h-[260px]">

            <Loader2
                className="size-3.5 animate-spin text-primary/70"
                strokeWidth={1.6}
            />

            <span className="text-[9px] font-mono tracking-[0.12em] text-muted-foreground/45 uppercase">
                {label}
            </span>

        </div>
    );
}

function DashboardLoader() {
    return (
        <div className="min-h-[70vh] flex items-center justify-center">

            <div className="relative border border-border bg-card px-6 py-4">

                <div className="absolute -top-1 -left-1 size-3 border-t border-l border-primary/40" />

                <div className="absolute -top-1 -right-1 size-3 border-t border-r border-primary/40" />

                <div className="flex items-center gap-3">

                    <Loader2
                        className="size-3.5 animate-spin text-primary"
                        strokeWidth={1.6}
                    />

                    <span className="text-[9px] font-mono tracking-[0.14em] text-muted-foreground/55 uppercase">
                        Initializing workspace…
                    </span>

                </div>

            </div>

        </div>
    );
}