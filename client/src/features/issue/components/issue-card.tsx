// issue-card.tsx
import { Calendar, ArrowRight } from "lucide-react";
import { PriorityBadge, StatusBadge } from "../../../components/ui/badges";
import { useState } from "react";
import { IssueDetailDrawer } from "./issue-detail-drawer";

export type IssueCardIssue = {
    id: string;
    title: string;
    description?: string;
    priority: 'URGENT' | 'HIGH' | 'MEDIUM' | 'LOW';
    status: 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE';
    project?: {
        id: string;
        name: string;
    };
    assignee?: {
        id: string;
        name: string;
        email?: string;
    };
    createdAt?: Date;
    updatedAt?: Date;
    dueDate?: Date | null;
    order?: number;
    labels?: string[];
    key?: string;
};

type IssueCardProps = {
    issue: IssueCardIssue;
};

const statusBadgeMap: Record<IssueCardIssue["status"], "todo" | "progress" | "review" | "done"> = {
    TODO: "todo",
    IN_PROGRESS: "progress",
    IN_REVIEW: "review",
    DONE: "done",
};

const formatDueDate = (dueDate: IssueCardIssue["dueDate"]) => {
    if (!dueDate) return null;

    const date = new Date(dueDate);
    if (Number.isNaN(date.getTime())) return null;

    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
    }).format(date);
};

export const IssueCard = ({ issue }: IssueCardProps) => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const dueDateLabel = formatDueDate(issue.dueDate);

    // Ensure the issue has all required fields for the drawer with proper types
    const drawerIssue = {
        ...issue,
        project: issue.project || { id: '', name: 'Uncategorized' },
        // Convert string dates to Date objects if needed
        createdAt: issue.createdAt ? new Date(issue.createdAt) : new Date(),
        updatedAt: issue.updatedAt ? new Date(issue.updatedAt) : new Date(),
        dueDate: issue.dueDate ? new Date(issue.dueDate) : null,
    };

    return (
        <>
            <article
                className="group relative grid grid-cols-[auto_1fr_auto] items-center gap-2.5 px-3.5 py-2.5 hover:bg-surface/30 transition-colors cursor-pointer border-l-2 border-transparent hover:border-primary/40"
                onClick={() => setIsDrawerOpen(true)}
            >
                {/* Priority and ID */}
                <div className="flex items-center gap-2.5 min-w-0">
                    <PriorityBadge
                        priority={issue.priority.toLowerCase() as "urgent" | "high" | "medium" | "low"}
                        compact
                    />
                    <span className="font-mono text-[9.5px] text-muted-foreground/65 w-16 shrink-0 tracking-wide hidden sm:inline">
                        {issue.key || issue.id.slice(0, 8).toUpperCase()}
                    </span>
                </div>

                {/* Issue details */}
                <div className="min-w-0 flex-1">
                    <p className="text-[13px] text-foreground/85 group-hover:text-foreground transition-colors line-clamp-1">
                        {issue.title}
                    </p>
                    {issue.description && (
                        <p className="text-[11.5px] text-muted-foreground/60 line-clamp-1 mt-0.5">
                            {issue.description}
                        </p>
                    )}
                </div>

                {/* Meta info */}
                <div className="flex items-center gap-4 whitespace-nowrap">
                    <StatusBadge status={statusBadgeMap[issue.status]} />

                    {dueDateLabel && (
                        <span className="inline-flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground/50 tracking-wide">
                            <Calendar className="size-3" strokeWidth={1.8} />
                            {dueDateLabel}
                        </span>
                    )}

                    <ArrowRight
                        className="size-3.5 text-primary/60 opacity-0 group-hover:opacity-100 transition-opacity"
                        strokeWidth={2}
                    />
                </div>
            </article>

            <IssueDetailDrawer
                issue={drawerIssue}
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
            />
        </>
    );
};