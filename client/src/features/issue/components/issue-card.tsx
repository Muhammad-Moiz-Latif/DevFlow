import { Calendar } from "lucide-react";
import { PriorityBadge, StatusBadge } from "../../../components/ui/badges";

export type IssueCardIssue = {
    id: string;
    title: string;
    description: string;
    status: "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE";
    priority: "URGENT" | "HIGH" | "MEDIUM" | "LOW";
    dueDate: string | Date | null;
};

type IssueCardProps = {
    issue: IssueCardIssue;
};

const statusBorderMap: Record<IssueCardIssue["status"], string> = {
    TODO: "border-l-status-todo",
    IN_PROGRESS: "border-l-status-progress",
    IN_REVIEW: "border-l-status-review",
    DONE: "border-l-status-done",
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
        year: "numeric",
    }).format(date);
};

export const IssueCard = ({ issue }: IssueCardProps) => {
    const dueDateLabel = formatDueDate(issue.dueDate);

    return (
        <article className={`grid grid-cols-[auto_1fr_auto] items-center gap-4 border-b border-border/60 px-4 py-4`}>
            <div className="flex items-center gap-3 min-w-0">
                <PriorityBadge priority={issue.priority.toLowerCase() as "urgent" | "high" | "medium" | "low"} compact />
                <span className="hidden rounded-md border border-border/60 bg-background/70 px-2 py-1 text-[11px] font-medium tracking-wide text-muted-foreground md:inline-flex">
                    {issue.id.slice(0, 8).toUpperCase()}
                </span>
            </div>

            <div className="min-w-0">
                <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">
                    {issue.description}
                </p>
            </div>

            <div className="flex items-center gap-6 whitespace-nowrap text-sm">
                <StatusBadge status={statusBadgeMap[issue.status]} />
                {dueDateLabel && (
                    <span className="inline-flex items-center text-xs gap-1.5 text-muted-foreground">
                        <Calendar className="size-3.5" />
                        {dueDateLabel}
                    </span>
                )}
            </div>
        </article>
    );
};
