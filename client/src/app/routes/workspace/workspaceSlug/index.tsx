import { TrendingUp, CheckCircle2, Clock, AlertCircle, Loader2 } from "lucide-react";
import { PriorityBadge, StatusBadge, Avatar } from "../../../../components/ui/badges";
import { useMyIssues } from "../../../../features/workspace/query/useMyIssues";
import { useParams } from "react-router";
import { useCurrentWorkspace } from "../../../../features/workspace/query/useCurrentWorkspace";
import { useAuthStore } from "../../../../stores/auth-store";
import { useAllActivityLogs } from "../../../../features/workspace/query/useAllActivityLogs";
import { useMemo } from "react";

type Priority = "urgent" | "high" | "medium" | "low";
type Status = "todo" | "progress" | "review" | "done";

const mapPriority = (priority: string): Priority => {
    const map: Record<string, Priority> = {
        'URGENT': 'urgent',
        'HIGH': 'high',
        'MEDIUM': 'medium',
        'LOW': 'low',
    };
    return map[priority] || 'low';
};

const mapStatus = (status: string): Status => {
    const map: Record<string, Status> = {
        'TODO': 'todo',
        'IN_PROGRESS': 'progress',
        'IN_REVIEW': 'review',
        'DONE': 'done',
    };
    return map[status] || 'todo';
};

const formatDate = (date: Date | string): string => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const formatTimeAgo = (date: Date | string): string => {
    const d = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays}d ago`;
};

const getActivityMessage = (log: any): string => {
    const { logType, newValue } = log;
    switch (logType) {
        case 'STATUS_CHANGED':
            return `changed status to ${newValue}`;
        case 'PRIORITY_CHANGED':
            return `changed priority to ${newValue}`;
        case 'ASSIGNEE_CHANGED':
            return `reassigned issue`;
        case 'COMMENT_ADDED':
            return `commented on issue`;
        case 'COMMENT_DELETED':
            return `deleted a comment`;
        case 'ISSUE_CREATED':
            return `created issue`;
        default:
            return 'updated issue';
    }
};

export function Dashboard() {
    const { user } = useAuthStore();
    const { workspaceSlug } = useParams();
    const { data: workspaceData, isPending } = useCurrentWorkspace(workspaceSlug!);
    const { data: allIssues, isPending: isIssuesPending } = useMyIssues(user?._id!, workspaceData?.data?.id!);
    const { data: allActivityLogs, isPending: isActivityPending } = useAllActivityLogs(workspaceData?.data?.id!);

    const { openIssues, urgentIssues, completedIssues } = useMemo(() => {
        if (!allIssues?.data) {
            return { openIssues: 0, urgentIssues: 0, completedIssues: 0 };
        }

        let openIssues = 0;
        let urgentIssues = 0;
        let completedIssues = 0;

        allIssues.data.forEach((issue) => {
            openIssues++;
            if (issue.priority === 'URGENT') urgentIssues++;
            if (issue.status === 'DONE') completedIssues++;
        });

        return { openIssues, urgentIssues, completedIssues };
    }, [allIssues?.data]);


    if (!user || isPending || !workspaceData?.data) {
        return (
            <div className="p-6 max-w-6xl mx-auto flex items-center justify-center min-h-screen">
                <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="size-4 animate-spin" />
                    Loading workspace...
                </div>
            </div>
        );
    }


    return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="mb-8">
                <div className="text-xs text-muted-foreground mb-1">Tuesday, April 23</div>
                <h1 className="text-2xl font-semibold tracking-tight">Good afternoon, Jordan</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    You have <span className="text-foreground font-medium">{openIssues} {openIssues > 1 ? "issues" : "issue"}</span> assigned and{" "}
                    <span className="text-foreground font-medium">3 due this week</span>.
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-3 mb-8">
                <Stat icon={Clock} label="Open" value={openIssues} tone="status-progress" />
                <Stat icon={AlertCircle} label="Urgent" value={urgentIssues} tone="priority-urgent" />
                <Stat icon={CheckCircle2} label="Completed" value={completedIssues} tone="status-done" />
                <Stat icon={TrendingUp} label="Velocity" value="+12%" tone="primary" />
            </div>

            <div className="grid grid-cols-3 gap-5">
                {/* My issues */}
                <div className="col-span-2 bg-card border border-border rounded-lg overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                        <h2 className="text-sm font-semibold">Assigned to you</h2>
                        <button className="text-xs text-primary hover:underline">View all</button>
                    </div>
                    <div className="divide-y divide-border">
                        {isIssuesPending ? (
                            <div className="flex items-center justify-center py-8 text-muted-foreground">
                                <Loader2 className="size-4 animate-spin mr-2" />
                                Loading issues...
                            </div>
                        ) : allIssues?.data && allIssues.data.length > 0 ? (
                            allIssues.data.slice(0, 5).map((issue) => (
                                <div key={issue.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-surface-elevated transition-colors cursor-pointer">
                                    <PriorityBadge priority={mapPriority(issue.priority)} compact />
                                    <span className="font-mono text-[10px] text-muted-foreground w-14 shrink-0">{issue.id.slice(0, 8).toUpperCase()}</span>
                                    <span className="text-sm flex-1 truncate">{issue.title}</span>
                                    <span className="text-[11px] text-muted-foreground hidden md:inline">Workspace</span>
                                    <StatusBadge status={mapStatus(issue.status)} />
                                    <span className="text-[11px] text-muted-foreground w-12 text-right">{formatDate(issue.dueDate)}</span>
                                </div>
                            ))
                        ) : (
                            <div className="flex items-center justify-center py-8 text-muted-foreground text-sm">
                                No issues assigned to you
                            </div>
                        )}
                    </div>
                </div>

                {/* Activity */}
                <div className="bg-card border border-border rounded-lg overflow-hidden">
                    <div className="px-4 py-3 border-b border-border">
                        <h2 className="text-sm font-semibold">Activity</h2>
                    </div>
                    <div className="p-4 space-y-3.5">
                        {isActivityPending ? (
                            <div className="flex items-center justify-center py-8 text-muted-foreground">
                                <Loader2 className="size-4 animate-spin mr-2" />
                                Loading activity...
                            </div>
                        ) : allActivityLogs?.data && allActivityLogs.data.length > 0 ? (
                            allActivityLogs.data.slice(0, 5).map((log, i) => (
                                <div key={`${log.id}-${i}`} className="flex gap-2.5">
                                    <Avatar name={log.actor.username} size={24} />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs text-foreground/85 leading-snug">
                                            <span className="font-semibold text-foreground">{log.actor.username}</span> {getActivityMessage(log)}
                                        </p>
                                        <span className="text-[10px] text-muted-foreground">{formatTimeAgo(log.createdAt)}</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="flex items-center justify-center py-8 text-muted-foreground text-sm">
                                No activity yet
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function Stat({ icon: Icon, label, value, tone }: any) {
    return (
        <div className="bg-card border border-border rounded-lg p-4">
            <div className={`size-7 rounded-md bg-${tone}/15 flex items-center justify-center mb-3`}>
                <Icon className={`size-4 text-${tone}`} />
            </div>
            <div className="text-2xl font-semibold tracking-tight">{value}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
        </div>
    );
}
