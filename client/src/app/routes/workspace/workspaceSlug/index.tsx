import {
    CheckCircle2,
    Clock,
    Loader2,
    ArrowRight,
} from "lucide-react";
import { PriorityBadge, StatusBadge } from "../../../../components/ui/badges";
import { useMyIssues } from "../../../../features/workspace/query/useMyIssues";
import { useParams } from "react-router";
import { useCurrentWorkspace } from "../../../../features/workspace/query/useCurrentWorkspace";
import { useAuthStore } from "../../../../stores/auth-store";
import { useAllActivityLogs } from "../../../../features/workspace/query/useAllActivityLogs";
import { useMemo } from "react";
import { Link } from "react-router";

type Priority = "urgent" | "high" | "medium" | "low";
type Status = "todo" | "progress" | "review" | "done";

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

const formatDate = (date: Date | string): string => {
    const d = new Date(date);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
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
            return `reassigned issue`;
        case "COMMENT_ADDED":
            return `commented on issue`;
        case "COMMENT_DELETED":
            return `deleted a comment`;
        case "ISSUE_CREATED":
            return `created issue`;
        default:
            return "updated issue";
    }
};

export function Dashboard() {
    const { user } = useAuthStore();
    const { workspaceSlug } = useParams();
    const { data: workspaceData, isPending } = useCurrentWorkspace(workspaceSlug!);
    const { data: allIssues, isPending: isIssuesPending } = useMyIssues(
        user?._id!,
        workspaceData?.data?.id!
    );
    const { data: allActivityLogs, isPending: isActivityPending } =
        useAllActivityLogs(workspaceData?.data?.id!);

    const { openIssues, urgentIssues, completedIssues, completionRate } = useMemo(() => {
        if (!allIssues?.data) {
            return { openIssues: 0, urgentIssues: 0, completedIssues: 0, completionRate: 0 };
        }

        let openIssues = 0;
        let urgentIssues = 0;
        let completedIssues = 0;

        allIssues.data.forEach((issue) => {
            openIssues++;
            if (issue.priority === "URGENT") urgentIssues++;
            if (issue.status === "DONE") completedIssues++;
        });

        const completionRate = openIssues > 0 ? Math.round((completedIssues / openIssues) * 100) : 0;

        return { openIssues, urgentIssues, completedIssues, completionRate };
    }, [allIssues?.data]);

    if (!user || isPending || !workspaceData?.data) {
        return (
            <div className="p-6 max-w-6xl mx-auto flex items-center justify-center min-h-[60vh]">
                <div className="flex items-center gap-2.5 border border-border bg-card px-5 py-3">
                    <Loader2 className="size-3.5 animate-spin text-primary" />
                    <span className="text-[12px] font-mono tracking-wide text-muted-foreground">
                        Loading workspace…
                    </span>
                </div>
            </div>
        );
    }

    const hour = new Date().getHours();
    const greeting =
        hour < 12 ? "morning" : hour < 17 ? "afternoon" : "evening";

    const railLength = Math.min(Math.max(openIssues, 1), 24);

    return (
        <div className="p-5 md:p-6 max-w-6xl mx-auto">
            {/* ── Title block ── */}
            <div className="relative mb-7 pb-5 border-b border-border">
                <div className="absolute top-0 left-0 size-2 border-t border-l border-primary/40" />
                <div className="absolute top-0 right-0 size-2 border-t border-r border-primary/40" />

                <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                        <div className="inline-flex items-center gap-3 mb-3 text-[10px] font-mono tracking-[0.14em] text-muted-foreground/55 uppercase">
                            <span className="w-4 h-px bg-border" />
                            Fig. 10 — Dashboard
                            <span className="w-4 h-px bg-border" />
                            <span className="text-muted-foreground/40">
                                {new Date().toLocaleDateString("en-US", {
                                    weekday: "short",
                                    month: "short",
                                    day: "numeric",
                                })}
                            </span>
                            <span className="w-px h-2.5 bg-border/50" />
                            <span className="flex items-center gap-1.5 text-primary/70 normal-case tracking-wide">
                                <span className="size-1 rounded-full bg-primary animate-pulse" />
                                LIVE
                            </span>
                        </div>

                        <h1 className="text-[1.5rem] md:text-[1.65rem] font-semibold tracking-[-0.03em] leading-tight">
                            Good {greeting}, {user?.username}
                        </h1>

                        <p className="text-[13.5px] text-muted-foreground mt-1.5 leading-relaxed">
                            You have{" "}
                            <span className="text-foreground font-medium">
                                {openIssues} {openIssues === 1 ? "issue" : "issues"}
                            </span>{" "}
                            assigned
                            {urgentIssues > 0 && (
                                <>
                                    {" "}
                                    ·{" "}
                                    <span className="text-priority-urgent font-medium">
                                        {urgentIssues} urgent
                                    </span>
                                </>
                            )}
                            {completedIssues > 0 && (
                                <>
                                    {" "}
                                    ·{" "}
                                    <span className="text-status-done font-medium">
                                        {completedIssues} done
                                    </span>
                                </>
                            )}
                        </p>

                        {/* Workload rail — same scale-bar motif as the Hero, driven by real data */}
                        <div className="mt-4 flex items-center gap-2.5">
                            <div className="flex items-end gap-[3px]">
                                {Array.from({ length: railLength }).map((_, i) => {
                                    const filled = i < completedIssues;
                                    return (
                                        <span
                                            key={i}
                                            className={filled ? "bg-status-done" : "bg-border/70"}
                                            style={{
                                                width: "2px",
                                                height: i % 4 === 0 ? "11px" : i % 2 === 0 ? "7px" : "4px",
                                            }}
                                        />
                                    );
                                })}
                            </div>
                            <span className="text-[9px] font-mono tracking-[0.14em] text-muted-foreground/40 uppercase">
                                Workload rail · {completedIssues}/{openIssues} closed
                            </span>
                        </div>
                    </div>

                    {/* Scale mark */}
                    <div className="hidden sm:flex flex-col items-end gap-1 pt-1 shrink-0">
                        <div className="flex items-end gap-[2px]">
                            {Array.from({ length: 11 }).map((_, i) => (
                                <span
                                    key={i}
                                    className={i % 4 === 0 ? "bg-primary/45" : "bg-border/50"}
                                    style={{
                                        width: "1px",
                                        height: i % 4 === 0 ? "9px" : i % 2 === 0 ? "5px" : "3px",
                                    }}
                                />
                            ))}
                        </div>
                        <span className="text-[8px] font-mono tracking-[0.16em] text-muted-foreground/35 uppercase">
                            Scale 1:1
                        </span>
                    </div>
                </div>
            </div>

            {/* ── Instrument strip ── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border border border-border mb-6">
                <StatCell label="Open" value={openIssues} hint="Active" tone="progress" />
                <StatCell label="Urgent" value={urgentIssues} hint="Attention" tone="urgent" />
                <DialCell value={completionRate} label="Completion" total={openIssues} />
                <StatCell label="Velocity" value="+12%" hint="vs last" tone="primary" />
            </div>

            {/* ── Main grid ── */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                {/* Assigned issues */}
                <div className="lg:col-span-3 border border-border bg-card overflow-hidden">
                    <div className="h-9 border-b border-border bg-sidebar/40 flex items-center px-3.5 gap-2.5">
                        <span className="text-[10px] font-mono tracking-wide text-muted-foreground/60">
                            ASSIGNED
                        </span>
                        <span className="text-[10px] font-mono text-foreground/70">
                            {allIssues?.data?.length ?? 0}
                        </span>
                        <Link
                            to={`/w/${workspaceSlug}/my-issues`}
                            className="ml-auto group flex items-center gap-1 text-[11px] font-medium text-primary/75 hover:text-primary transition-colors"
                        >
                            View all
                            <ArrowRight
                                className="size-3 opacity-70 group-hover:translate-x-0.5 transition-transform"
                                strokeWidth={1.8}
                            />
                        </Link>
                    </div>

                    <div className="divide-y divide-border max-h-[400px] overflow-y-auto">
                        {isIssuesPending ? (
                            <div className="flex items-center justify-center py-14 gap-2 text-muted-foreground">
                                <Loader2 className="size-3.5 animate-spin text-primary" />
                                <span className="text-[11px] font-mono tracking-wide">
                                    Loading issues…
                                </span>
                            </div>
                        ) : allIssues?.data && allIssues.data.length > 0 ? (
                            allIssues.data.slice(0, 6).map((issue) => (
                                <div
                                    key={issue.id}
                                    className="flex items-center gap-2.5 px-3.5 py-2.5 hover:bg-surface/30 transition-colors cursor-pointer group"
                                >
                                    <PriorityBadge
                                        priority={mapPriority(issue.priority)}
                                        compact
                                    />
                                    <span className="font-mono text-[9.5px] text-muted-foreground/65 w-16 shrink-0 tracking-wide">
                                        {issue.id.slice(0, 8).toUpperCase()}
                                    </span>
                                    <span className="text-[13px] flex-1 truncate text-foreground/85 group-hover:text-foreground transition-colors">
                                        {issue.title}
                                    </span>
                                    <StatusBadge status={mapStatus(issue.status)} />
                                    <span className="text-[10px] font-mono text-muted-foreground/50 w-12 text-right tabular-nums">
                                        {formatDate(issue.dueDate)}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center py-14 gap-1.5">
                                <CheckCircle2
                                    className="size-6 text-muted-foreground/25"
                                    strokeWidth={1.5}
                                />
                                <p className="text-[13px] text-muted-foreground/60 tracking-tight">
                                    No issues assigned
                                </p>
                                <p className="text-[10px] font-mono text-muted-foreground/40 tracking-wide">
                                    All clear
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Activity log */}
                <div className="lg:col-span-2 border border-border bg-card overflow-hidden">
                    <div className="h-9 border-b border-border bg-sidebar/40 flex items-center px-3.5 gap-2.5">
                        <span className="text-[10px] font-mono tracking-wide text-muted-foreground/60">
                            ACTIVITY
                        </span>
                        <span className="text-[10px] font-mono text-foreground/70">
                            {allActivityLogs?.data?.length ?? 0}
                        </span>
                        <span className="ml-auto flex items-center gap-1.5 text-[10px] font-mono text-primary/70">
                            <span className="size-1 rounded-full bg-primary animate-pulse" />
                            LIVE
                        </span>
                    </div>

                    <div className="divide-y divide-border max-h-[400px] overflow-y-auto">
                        {isActivityPending ? (
                            <div className="flex items-center justify-center py-14 gap-2 text-muted-foreground">
                                <Loader2 className="size-3.5 animate-spin text-primary" />
                                <span className="text-[11px] font-mono tracking-wide">
                                    Loading activity…
                                </span>
                            </div>
                        ) : allActivityLogs?.data && allActivityLogs.data.length > 0 ? (
                            allActivityLogs.data.slice(0, 8).map((log, i) => {
                                const isLive = i === 0;
                                return (
                                    <div
                                        key={`${log.id}-${i}`}
                                        className={`flex gap-2.5 px-3.5 py-2.5 transition-colors ${isLive ? "bg-primary/[0.03]" : "hover:bg-surface/25"
                                            }`}
                                    >
                                        <div className="size-6 flex items-center justify-center border border-border text-[9px] font-mono text-muted-foreground shrink-0">
                                            {log.actor.username.slice(0, 2).toUpperCase()}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[12px] leading-snug text-foreground/85">
                                                <span className="font-medium">{log.actor.username}</span>{" "}
                                                <span className="text-muted-foreground/70">
                                                    {getActivityMessage(log)}
                                                </span>
                                            </p>
                                            <div className="flex items-center gap-1.5 mt-0.5">
                                                <span className="text-[9.5px] font-mono text-muted-foreground/50 tracking-wide">
                                                    {formatTimeAgo(log.createdAt)}
                                                </span>
                                                {isLive && (
                                                    <>
                                                        <span className="w-px h-2 bg-primary/30" />
                                                        <span className="text-[8px] font-mono text-primary/65 tracking-wide uppercase">
                                                            Live
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="flex flex-col items-center justify-center py-14 gap-1.5">
                                <Clock
                                    className="size-6 text-muted-foreground/25"
                                    strokeWidth={1.5}
                                />
                                <p className="text-[13px] text-muted-foreground/60 tracking-tight">
                                    No activity yet
                                </p>
                                <p className="text-[10px] font-mono text-muted-foreground/40 tracking-wide">
                                    Waiting for updates
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Sheet footer ── */}
            <div className="mt-6 flex items-center justify-between text-[9px] font-mono tracking-[0.12em] text-muted-foreground/30 uppercase border-t border-border/50 pt-3">
                <span>Sheet 01 / 01</span>
                <div className="flex items-center gap-2.5">
                    <span>v2.0.1</span>
                    <span className="w-px h-2 bg-border/40" />
                    <span>devflow.app</span>
                </div>
            </div>
        </div>
    );
}

/* ── Stat cell (instrument strip) ── */
function StatCell({
    label,
    value,
    hint,
    tone,
}: {
    label: string;
    value: string | number;
    hint: string;
    tone: "progress" | "urgent" | "done" | "primary";
}) {
    const toneClass = {
        progress: "text-status-progress",
        urgent: "text-priority-urgent",
        done: "text-status-done",
        primary: "text-primary",
    }[tone];

    return (
        <div className="bg-background px-4 py-3.5 hover:bg-surface/25 transition-colors">
            <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-mono tracking-[0.1em] text-muted-foreground/50 uppercase">
                    {label}
                </span>
                <span className={`text-[10px] font-mono ${toneClass}`}>{hint}</span>
            </div>
            <div className="text-[1.4rem] font-semibold tracking-[-0.02em] tabular-nums">
                {value}
            </div>
        </div>
    );
}

/* ── Dial cell — the one signature instrument in the strip ── */
function DialCell({ value, label, total }: { value: number; label: string; total: number }) {
    return (
        <div className="bg-background px-4 py-3.5 flex items-center gap-3 hover:bg-surface/25 transition-colors">
            <div
                className="relative size-10 shrink-0 rounded-full"
                style={{
                    background: `conic-gradient(oklch(0.72 0.20 290) ${value * 3.6}deg, oklch(1 0 0 / 0.08) 0deg)`,
                }}
            >
                <div className="absolute inset-[3px] rounded-full bg-background flex items-center justify-center">
                    <span className="text-[9px] font-mono font-semibold tabular-nums">
                        {value}%
                    </span>
                </div>
            </div>
            <div className="min-w-0">
                <span className="block text-[10px] font-mono tracking-[0.1em] text-muted-foreground/50 uppercase">
                    {label}
                </span>
                <span className="block text-[10px] font-mono text-muted-foreground/60 mt-1">
                    of {total} tracked
                </span>
            </div>
        </div>
    );
}