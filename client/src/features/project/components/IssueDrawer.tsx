import { X, Calendar, Tag, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { PriorityBadge, StatusBadge, Avatar } from "../../../components/ui/badges";
import type { IssueType } from "../../types";

export function IssueDrawer({ issue, onClose }: { issue: IssueType; onClose: () => void }) {
    const [isClosing, setIsClosing] = useState(false);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            onClose();
        }, 300);
    };
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

    // handle assign issue

    // handle change priority

    // handle change dueDate

    const formattedDate = issue.dueDate ? formatFullDate(new Date(issue.dueDate)) : null;

    return (
        <>
            <div
                className={`fixed inset-0 bg-background/60 backdrop-blur-sm z-40 transition-opacity duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'
                    }`}
                onClick={handleClose}
            />
            <aside className={`fixed top-0 right-0 h-screen w-130 bg-surface border-l border-border z-50 flex flex-col shadow-2xl overflow-hidden transition-transform duration-300 ${isClosing ? 'translate-x-full' : 'translate-x-0'
                }`}>
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-3 border-b border-border">
                    <div className="flex items-center gap-2 text-xs">
                        <span className="font-mono text-muted-foreground">{issue.id.slice(0, 8)}</span>
                        <span className="text-muted-foreground">·</span>
                        <StatusBadge status={statusMap[issue.status] as "todo" | "progress" | "review" | "done"} />
                    </div>
                    <div className="flex items-center gap-1">
                        <button className="size-7 rounded-md hover:bg-accent flex items-center justify-center transition-colors">
                            <MoreHorizontal className="size-4 text-muted-foreground" />
                        </button>
                        <button onClick={handleClose} className="size-7 rounded-md hover:bg-accent flex items-center justify-center transition-colors">
                            <X className="size-4 text-muted-foreground" />
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto scrollbar-thin">
                    <div className="px-5 py-5">
                        <h2 className="text-lg font-semibold leading-tight mb-3">{issue.title}</h2>
                        <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                            {issue.description || "No description provided"}
                        </p>

                        {/* Properties */}
                        <div className="space-y-2.5 text-xs border-t border-border pt-4">
                            <Property label="Status">
                                <StatusBadge status={statusMap[issue.status] as "todo" | "progress" | "review" | "done"} />
                            </Property>
                            <Property label="Priority">
                                <div className="flex justify-between">
                                    <PriorityBadge priority={issue.priority.toLowerCase() as "urgent" | "high" | "medium" | "low"} />
                                    <button
                                        className="border w-24 border-zinc-800 text-xs tracking-tight py-1 rounded-md
                                    hover:opacity-60 hover:cursor-pointer"
                                    >change priority</button>
                                </div>
                            </Property>
                            <Property label="Assignee">
                                <div className="flex justify-between">
                                    <div className="flex items-center gap-1.5">
                                        <Avatar name={issue.assignee?.name || "Unassigned"} size={20} />
                                        <span className="text-foreground">{issue.assignee?.name || "Unassigned"}</span>
                                    </div>
                                    <button
                                        className="border border-zinc-800 text-xs tracking-tight w-24 py-1 rounded-md
                                    hover:opacity-60 hover:cursor-pointer"
                                    >{issue.assignee ? "Reassign issue" : "Assign issue"}</button>
                                </div>
                            </Property>
                            <Property label="Due date">
                                <div className="flex justify-between">
                                    <span className="inline-flex items-center gap-1.5 text-foreground">
                                        <Calendar className="size-3.5 text-muted-foreground" />
                                        {formattedDate || "No due date"}
                                    </span>
                                    <button
                                        className="border w-24 border-zinc-800 text-xs tracking-tight py-1 rounded-md
                                    hover:opacity-60 hover:cursor-pointer"
                                    >Update dueDate</button>
                                </div>

                            </Property>
                            <Property label="Labels">
                                <div className="flex gap-1">
                                    <span className="text-muted-foreground italic text-[10px]">To be implemented</span>
                                </div>
                            </Property>
                            <Property label="Created by">
                                <div className="flex items-center gap-1.5">
                                    <Avatar name={issue.creator?.name || "Unknown"} size={20} />
                                    <span className="text-foreground">{issue.creator?.name || "Unknown"}</span>
                                </div>
                            </Property>
                        </div>

                        {/* Activity */}
                        <div className="mt-6">
                            <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                                Activity
                            </h3>
                            <div className="space-y-2.5 border-l border-border pl-4 ml-1.5">
                                <ActivityItem
                                    actor={issue.creator?.name || "Unknown"}
                                    action="created the issue"
                                    time={formatTimeAgo(issue.createdAt)}
                                />
                            </div>
                            <p className="text-muted-foreground italic text-[10px] mt-2">Additional activity tracking to be implemented</p>
                        </div>

                        {/* Comments */}
                        <div className="mt-6">
                            <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                                Comments · 0
                            </h3>
                            <p className="text-muted-foreground italic text-[10px]">Comments feature to be implemented</p>
                        </div>
                    </div>
                </div>

                {/* Composer */}
                <div className="border-t border-border p-3">
                    <div className="bg-background border border-border rounded-md focus-within:ring-1 focus-within:ring-ring focus-within:border-primary/40">
                        <textarea
                            placeholder="Leave a comment..."
                            rows={2}
                            disabled
                            className="w-full bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground resize-none focus:outline-none disabled:opacity-50 cursor-not-allowed"
                        />
                        <div className="flex items-center justify-between px-2 py-1.5 border-t border-border">
                            <button disabled className="text-xs text-muted-foreground inline-flex items-center gap-1 hover:text-foreground disabled:opacity-50 cursor-not-allowed">
                                <Tag className="size-3" /> Mention
                            </button>
                            <button disabled className="inline-flex items-center gap-1.5 h-7 px-2.5 rounded bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 disabled:opacity-50 cursor-not-allowed">
                                Comment
                            </button>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}

function Property({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="grid grid-cols-[100px_1fr] items-center">
            <span className="text-muted-foreground">{label}</span>
            <div>{children}</div>
        </div>
    );
}

function ActivityItem({ actor, action, time }: { actor: string; action: string; time: string }) {
    return (
        <div className="relative text-xs text-muted-foreground">
            <span className="absolute -left-5.25 top-1.5 size-2 rounded-full bg-border ring-2 ring-surface" />
            <span className="text-foreground font-medium">{actor}</span> {action}
            <span className="text-muted-foreground/70"> · {time}</span>
        </div>
    );
}
