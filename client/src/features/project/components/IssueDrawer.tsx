import { X, Calendar, Tag, MoreHorizontal, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { PriorityBadge, StatusBadge, Avatar } from "../../../components/ui/badges";
import type { IssueType } from "../../types";
import { useParams } from "react-router";
import { useCurrentWorkspace } from "../../workspace/query/useCurrentWorkspace";
import { useWorkspaceMembers } from "../../members/query/useWorkspaceMembers";
import { useUpdateIssue } from "../../issue/queries/useUpdateIssue";
import { useCurrentProject } from "../query/useCurrentProject";

export function IssueDrawer({ issue, onClose }: { issue: IssueType; onClose: () => void }) {
    const [isClosing, setIsClosing] = useState(false);
    const [showPriorityMenu, setShowPriorityMenu] = useState(false);
    const [showMembersDrawer, setShowMembersDrawer] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [displayIssue, setDisplayIssue] = useState<IssueType>(issue);

    useEffect(() => {
        setDisplayIssue(issue);
    }, [issue]);

    const { workspaceSlug, projectSlug } = useParams();
    const { data: workspaceData } = useCurrentWorkspace(workspaceSlug!);
    const { data: projectData } = useCurrentProject(projectSlug!, workspaceData?.data?.id!);
    const { data: workspaceMembers } = useWorkspaceMembers(workspaceData?.data?.id!);
    const { mutate } = useUpdateIssue(workspaceData?.data?.id!, projectData?.data?.id!);

    console.log(issue.logs)

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            onClose();
        }, 300);
    };

    const handlePriorityChange = (newPriority: "URGENT" | "HIGH" | "MEDIUM" | "LOW") => {
        setDisplayIssue({ ...displayIssue, priority: newPriority });
        mutate({
            id: displayIssue.id,
            priority: newPriority
        });
        setShowPriorityMenu(false);
    };

    const handleAssignMember = (memberId: string) => {
        const memberData = workspaceMembers?.data?.find((m: any) => m.user.id === memberId);
        if (memberData) {
            setDisplayIssue({
                ...displayIssue,
                assignee: {
                    id: memberData.user.id,
                    name: memberData.user.name,
                    email: memberData.user.email,
                    img: memberData.user.img
                }
            });
        }
        mutate({
            id: displayIssue.id,
            assignee_id: memberId
        });
        setShowMembersDrawer(false);
    };

    const handleUnassign = () => {
        setDisplayIssue({ ...displayIssue, assignee: null as any });
        mutate({
            id: displayIssue.id,
            assignee_id: ""
        });
        setShowMembersDrawer(false);
    };

    const handleDueDateChange = (newDate: string) => {
        setDisplayIssue({ ...displayIssue, dueDate: new Date(newDate) });
        mutate({
            id: displayIssue.id,
            dueDate: new Date(newDate)
        });
        setShowDatePicker(false);
    };

    function formatStatusLabel(status: string | null): string {
        const map: Record<string, string> = {
            TODO: "To Do",
            IN_PROGRESS: "In Progress",
            IN_REVIEW: "In Review",
            DONE: "Done",
        };
        return status ? (map[status] ?? status) : "none";
    }

    function formatPriorityLabel(priority: string | null): string {
        const map: Record<string, string> = {
            URGENT: "Urgent",
            HIGH: "High",
            MEDIUM: "Medium",
            LOW: "Low",
        };
        return priority ? (map[priority] ?? priority) : "none";
    }

    function getActivityAction(log: IssueType["logs"][number]): string {
        switch (log.type) {
            case "ISSUE_CREATED":
                return "created the issue";

            case "STATUS_CHANGED":
                return `changed status from ${formatStatusLabel(log.oldValue)} to ${formatStatusLabel(log.newValue)}`;

            case "PRIORITY_CHANGED":
                return `changed priority from ${formatPriorityLabel(log.oldValue)} to ${formatPriorityLabel(log.newValue)}`;

            case "ASSIGNEE_CHANGED":
                return log.newValue
                    ? `assigned to ${log.newValue}`
                    : "unassigned this issue";

            case "COMMENT_ADDED":
                return "added a comment";

            case "COMMENT_DELETED":
                return "deleted a comment";

            default:
                return "updated the issue";
        }
    }

    const statusMap: Record<string, "todo" | "progress" | "review" | "done"> = {
        "TODO": "todo",
        "IN_PROGRESS": "progress",
        "IN_REVIEW": "review",
        "DONE": "done",
    };

    function formatFullDate(date: Date): string {
        const d = new Date(date);
        const month = d.toLocaleString("default", { month: "short" });
        const day = d.getDate();
        const year = d.getFullYear();
        return `${month} ${day}, ${year}`;
    }

    function formatTimeAgo(date: Date): string {
        const now = new Date();
        const diffMs = now.getTime() - new Date(date).getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return "now";
        if (diffMins < 60) return `${diffMins}m`;
        if (diffHours < 24) return `${diffHours}h`;
        if (diffDays < 7) return `${diffDays}d`;

        return formatFullDate(date);
    }

    return (
        <>
            <div
                className={`fixed inset-0 bg-background/60 backdrop-blur-sm z-40 transition-opacity duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'
                    }`}
                onClick={handleClose}
            />
            <aside className={`fixed top-0 right-0 h-screen w-130 bg-card border-l border-border z-50 flex flex-col overflow-hidden transition-transform duration-300 ${isClosing ? 'translate-x-full' : 'translate-x-0'
                }`}>
                {/* Title block — same language as board / activity panels */}
                <div className="h-9 border-b border-border bg-sidebar/40 flex items-center px-3.5 gap-2.5 shrink-0">
                    <span className="text-[10px] font-mono tracking-wide text-muted-foreground/60 uppercase">
                        Issue
                    </span>
                    <span className="text-[10px] font-mono text-foreground/70">
                        {displayIssue.id.slice(0, 8).toUpperCase()}
                    </span>
                    <span className="w-px h-2.5 bg-border" />
                    <StatusBadge status={statusMap[displayIssue.status] as "todo" | "progress" | "review" | "done"} />

                    <div className="ml-auto flex items-center gap-1">
                        <button className="size-6 flex items-center justify-center text-muted-foreground/60 hover:text-foreground hover:bg-surface/60 transition-colors">
                            <MoreHorizontal className="size-3.5" strokeWidth={1.8} />
                        </button>
                        <button onClick={handleClose} className="size-6 flex items-center justify-center text-muted-foreground/60 hover:text-foreground hover:bg-surface/60 transition-colors">
                            <X className="size-3.5" strokeWidth={1.8} />
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto scrollbar-thin">
                    <div className="px-5 py-5">
                        <h2 className="text-[1.15rem] font-semibold tracking-[-0.02em] leading-tight mb-2.5">
                            {displayIssue.title}
                        </h2>
                        <p className="text-[13px] text-muted-foreground leading-relaxed mb-5">
                            {displayIssue.description || "No description provided"}
                        </p>

                        {/* Properties */}
                        <div className="space-y-3 text-[12.5px] border-t border-border pt-4">
                            <Property label="Status">
                                <StatusBadge status={statusMap[displayIssue.status] as "todo" | "progress" | "review" | "done"} />
                            </Property>
                            <Property label="Priority">
                                <div className="flex justify-between items-center relative">
                                    <PriorityBadge priority={displayIssue.priority.toLowerCase() as "urgent" | "high" | "medium" | "low"} />
                                    <button
                                        onClick={() => setShowPriorityMenu(!showPriorityMenu)}
                                        className="h-7 px-2.5 border border-border/70 text-[10px] font-mono uppercase tracking-wide text-muted-foreground/70 hover:text-foreground hover:border-border hover:bg-surface/40 transition-colors"
                                    >
                                        Change
                                    </button>
                                    {showPriorityMenu && (
                                        <div className="absolute right-0 top-full mt-1.5 bg-card border border-border shadow-sm z-10 w-32">
                                            {(['URGENT', 'HIGH', 'MEDIUM', 'LOW'] as const).map((p) => (
                                                <button
                                                    key={p}
                                                    onClick={() => handlePriorityChange(p)}
                                                    className="w-full text-left px-3 py-2 text-[11px] font-mono tracking-wide hover:bg-surface/50 transition-colors flex items-center justify-between"
                                                >
                                                    {p}
                                                    {displayIssue.priority === p && <Check className="size-3 text-primary" />}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </Property>
                            <Property label="Assignee">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-1.5">
                                        <Avatar name={displayIssue.assignee?.name || "Unassigned"} size={20} />
                                        <span className="text-foreground/85">{displayIssue.assignee?.name || "Unassigned"}</span>
                                    </div>
                                    <button
                                        onClick={() => setShowMembersDrawer(true)}
                                        className="h-7 px-2.5 border border-border/70 text-[10px] font-mono uppercase tracking-wide text-muted-foreground/70 hover:text-foreground hover:border-border hover:bg-surface/40 transition-colors"
                                    >
                                        {displayIssue.assignee ? "Reassign" : "Assign"}
                                    </button>
                                </div>
                            </Property>
                            <Property label="Due date">
                                <div className="flex justify-between items-center relative">
                                    <span className="inline-flex items-center gap-1.5 text-foreground/85">
                                        <Calendar className="size-3.5 text-muted-foreground/60" strokeWidth={1.8} />
                                        {displayIssue.dueDate ? formatFullDate(new Date(displayIssue.dueDate)) : "No due date"}
                                    </span>
                                    <div className="relative">
                                        <button
                                            onClick={() => setShowDatePicker(!showDatePicker)}
                                            className="h-7 px-2.5 border border-border/70 text-[10px] font-mono uppercase tracking-wide text-muted-foreground/70 hover:text-foreground hover:border-border hover:bg-surface/40 transition-colors"
                                        >
                                            Update
                                        </button>
                                        {showDatePicker && (
                                            <div className="absolute right-0 top-full mt-1.5 bg-card border border-border shadow-sm z-10 p-3 w-48">
                                                <input
                                                    type="date"
                                                    defaultValue={issue.dueDate ? new Date(issue.dueDate).toISOString().split('T')[0] : ''}
                                                    onChange={(e) => handleDueDateChange(e.target.value)}
                                                    className="w-full px-2 py-1.5 rounded-md bg-background border border-border/70 text-[12px] text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50"
                                                />
                                                {issue.dueDate && (
                                                    <button
                                                        onClick={() => {
                                                            setDisplayIssue({ ...displayIssue, dueDate: null as any });
                                                            mutate({
                                                                id: displayIssue.id,
                                                                dueDate: null as any
                                                            });
                                                            setShowDatePicker(false);
                                                        }}
                                                        className="w-full mt-2 text-[10px] font-mono uppercase tracking-wide text-muted-foreground/60 hover:text-foreground py-1 transition-colors"
                                                    >
                                                        Clear due date
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Property>
                            <Property label="Labels">
                                <span className="text-muted-foreground/50 italic text-[11px]">To be implemented</span>
                            </Property>
                            <Property label="Created by">
                                <div className="flex items-center gap-1.5">
                                    <Avatar name={displayIssue.creator?.name || "Unknown"} size={20} />
                                    <span className="text-foreground/85">{displayIssue.creator?.name || "Unknown"}</span>
                                </div>
                            </Property>
                        </div>

                        {/* Activity */}
                        <div className="mt-6">
                            <h3 className="text-[10px] font-mono tracking-[0.12em] text-muted-foreground/50 uppercase mb-3">
                                Activity
                            </h3>
                            <div className="space-y-2.5 border-l border-border pl-4 ml-1.5">
                                {displayIssue.logs && displayIssue.logs.length > 0 ? (
                                    displayIssue.logs.map((log) => (
                                        <ActivityItem
                                            key={log.id}
                                            actor={log.actor?.username || "Unknown"}
                                            action={getActivityAction(log)}
                                            time={formatTimeAgo(log.createdAt)}
                                        />
                                    ))
                                ) : (
                                    <ActivityItem
                                        actor={displayIssue.creator?.name || "Unknown"}
                                        action="created the issue"
                                        time={formatTimeAgo(displayIssue.createdAt)}
                                    />
                                )}
                            </div>
                        </div>

                        {/* Comments */}
                        <div className="mt-6">
                            <h3 className="text-[10px] font-mono tracking-[0.12em] text-muted-foreground/50 uppercase mb-3">
                                Comments · 0
                            </h3>
                            <p className="text-muted-foreground/40 italic text-[10px]">Comments feature to be implemented</p>
                        </div>
                    </div>
                </div>

                {/* Composer */}
                <div className="border-t border-border p-3 shrink-0">
                    <div className="bg-background border border-border/70 rounded-md focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary/50 transition-all">
                        <textarea
                            placeholder="Leave a comment..."
                            rows={2}
                            disabled
                            className="w-full bg-transparent px-3 py-2 text-[13px] placeholder:text-muted-foreground/50 resize-none focus:outline-none disabled:opacity-50 cursor-not-allowed"
                        />
                        <div className="flex items-center justify-between px-2 py-1.5 border-t border-border/70">
                            <button disabled className="text-[10px] font-mono uppercase tracking-wide text-muted-foreground/50 inline-flex items-center gap-1 hover:text-foreground disabled:opacity-50 cursor-not-allowed">
                                <Tag className="size-3" /> Mention
                            </button>
                            <button disabled className="inline-flex items-center gap-1.5 h-7 px-2.5 rounded-md bg-primary text-primary-foreground text-[11px] font-medium hover:opacity-90 disabled:opacity-50 cursor-not-allowed">
                                Comment
                            </button>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Members Drawer */}
            {showMembersDrawer && (
                <>
                    <div
                        className="fixed inset-0 bg-background/60 backdrop-blur-sm z-50 transition-opacity"
                        onClick={() => setShowMembersDrawer(false)}
                    />
                    <div className="fixed inset-0 z-50 flex items-end">
                        <div className="bg-card border-t border-border w-full max-h-96 overflow-y-auto shadow-lg">
                            <div className="h-9 border-b border-border bg-sidebar/40 flex items-center px-3.5 sticky top-0">
                                <span className="text-[10px] font-mono tracking-wide text-muted-foreground/60 uppercase">
                                    Assign member
                                </span>
                                <button
                                    onClick={() => setShowMembersDrawer(false)}
                                    className="ml-auto size-6 flex items-center justify-center text-muted-foreground/60 hover:text-foreground hover:bg-surface/60 transition-colors"
                                >
                                    <X className="size-3.5" strokeWidth={1.8} />
                                </button>
                            </div>
                            <div className="p-3 space-y-0.5">
                                {displayIssue.assignee && (
                                    <button
                                        onClick={handleUnassign}
                                        className="w-full flex items-center justify-between px-3 py-2 text-[12px] hover:bg-surface/50 transition-colors text-muted-foreground/70 hover:text-foreground"
                                    >
                                        Unassigned
                                    </button>
                                )}
                                {workspaceMembers?.data && workspaceMembers.data.length > 0 ? (
                                    workspaceMembers.data.map((member: any) => (
                                        <button
                                            key={member.user.id}
                                            onClick={() => handleAssignMember(member.user.id)}
                                            className="w-full flex items-center justify-between px-3 py-2 text-[12px] hover:bg-surface/50 transition-colors"
                                        >
                                            <div className="flex items-center gap-2">
                                                <Avatar name={member.user.name} size={20} />
                                                <span className="text-foreground/85">{member.user.name}</span>
                                            </div>
                                            {displayIssue.assignee?.id === member.user.id && <Check className="size-3 text-primary" />}
                                        </button>
                                    ))
                                ) : (
                                    <div className="px-3 py-2 text-[12px] text-muted-foreground/50">
                                        No members available
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}

function Property({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="grid grid-cols-[90px_1fr] items-center">
            <span className="text-[10px] font-mono tracking-[0.08em] text-muted-foreground/50 uppercase">
                {label}
            </span>
            <div>{children}</div>
        </div>
    );
}

function ActivityItem({ actor, action, time }: { actor: string; action: string; time: string }) {
    return (
        <div className="relative text-[12px] text-muted-foreground/70">
            <span className="absolute -left-5.25 top-1.5 size-2 rounded-full bg-border ring-2 ring-card" />
            <span className="text-foreground/85 font-medium">{actor}</span> {action}
            <span className="text-muted-foreground/50"> · {time}</span>
        </div>
    );
}