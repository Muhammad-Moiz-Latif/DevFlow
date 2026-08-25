import { useMyIssues } from "../../features/workspace/query/useMyIssues";
import { useNavigate } from "react-router";
import { useParams } from "react-router";
import { Search, Calendar, ArrowRight } from "lucide-react";

type MyIssueType = {
    id: string;
    project_id: string;
    workspace_id: string;
    title: string;
    description: string;
    status: "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE";
    priority: "URGENT" | "HIGH" | "MEDIUM" | "LOW";
    assignee_id: string;
    createdBy: string;
    order: number;
    dueDate: Date;
    createdAt: Date;
    updatedAt: Date;
};

const SearchDropdown = ({
    debouncedValue,
    userId,
    workspaceId
}: {
    debouncedValue: string;
    userId: string;
    workspaceId: string;
}) => {
    const { data: MyIssues, isPending } = useMyIssues(userId, workspaceId);
    const navigate = useNavigate();
    const { workspaceSlug } = useParams();

    if (!debouncedValue.length) return null;

    const dropdownValues = MyIssues?.data?.filter((issue: MyIssueType) => (
        issue.title.toLowerCase().includes(debouncedValue.toLowerCase()) ||
        issue.description?.toLowerCase().includes(debouncedValue.toLowerCase())
    ));

    if (isPending) {
        return (
            <div className="absolute top-full left-0 mt-2 w-full bg-surface/95 backdrop-blur-md border border-border/60 rounded-lg shadow-lg overflow-hidden">
                <div className="flex items-center justify-center gap-2.5 px-4 py-6">
                    <div className="size-3.5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                    <span className="text-[11px] font-mono text-muted-foreground/60">Searching...</span>
                </div>
            </div>
        );
    }

    if (!dropdownValues?.length) {
        return (
            <div className="absolute top-full left-0 mt-2 w-full bg-surface/95 backdrop-blur-md border border-border/60 rounded-lg shadow-lg overflow-hidden">
                <div className="flex flex-col items-center justify-center px-4 py-8 gap-1.5">
                    <Search className="size-4 text-muted-foreground/25" strokeWidth={1.5} />
                    <p className="text-[11.5px] text-muted-foreground/50">No issues found</p>
                    <p className="text-[9px] font-mono text-muted-foreground/30 tracking-wide">
                        Try a different search term
                    </p>
                </div>
            </div>
        );
    }

    const priorityColors = {
        URGENT: 'bg-priority-urgent',
        HIGH: 'bg-priority-high',
        MEDIUM: 'bg-priority-medium',
        LOW: 'bg-priority-low',
    };

    const statusColors = {
        TODO: 'bg-status-todo',
        IN_PROGRESS: 'bg-status-progress',
        IN_REVIEW: 'bg-status-review',
        DONE: 'bg-status-done',
    };

    const statusLabels = {
        TODO: 'To Do',
        IN_PROGRESS: 'In Progress',
        IN_REVIEW: 'In Review',
        DONE: 'Done',
    };

    const priorityLabels = {
        URGENT: 'Urgent',
        HIGH: 'High',
        MEDIUM: 'Medium',
        LOW: 'Low',
    };

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
        });
    };

    const handleIssueClick = () => {
        // Navigate to the issue detail view
        // Adjust the path based on your routing structure
        navigate(`/w/${workspaceSlug}/my-issues`);

    };

    return (
        <div className="absolute top-full left-0 mt-2 w-full bg-surface border border-border/60 rounded-lg shadow-lg overflow-hidden z-50 max-h-[400px] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-border/40 bg-sidebar/20">
                <span className="text-[9px] font-mono tracking-[0.12em] text-muted-foreground/40 uppercase">
                    {dropdownValues.length} results
                </span>
                <span className="text-[9px] font-mono text-muted-foreground/30">
                    ⌘K to close
                </span>
            </div>

            {/* Results */}
            <div className="divide-y divide-border/40">
                {dropdownValues.map((issue: MyIssueType) => (
                    <button
                        key={issue.id}
                        onClick={handleIssueClick}
                        className="w-full text-left px-4 py-2.5 hover:bg-surface/40 transition-all group flex items-start gap-3"
                    >
                        {/* Priority + Status indicators */}
                        <div className="flex flex-col items-center gap-0.5 pt-0.5 shrink-0">
                            <span className={`size-1.5 rounded-full ${priorityColors[issue.priority]}`} />
                            <span className={`size-1.5 rounded-full ${statusColors[issue.status]}`} />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-mono text-muted-foreground/50 shrink-0">
                                    #{issue.order || issue.id.slice(0, 6).toUpperCase()}
                                </span>
                                <span className="text-[12.5px] text-foreground/85 group-hover:text-foreground transition-colors truncate">
                                    {issue.title}
                                </span>
                            </div>

                            {/* Description preview */}
                            {issue.description && (
                                <p className="text-[10.5px] text-muted-foreground/50 line-clamp-1 mt-0.5">
                                    {issue.description}
                                </p>
                            )}

                            {/* Meta row */}
                            <div className="flex items-center gap-3 mt-1.5">
                                <div className="flex items-center gap-1">
                                    <span className={`size-1 rounded-full ${statusColors[issue.status]}`} />
                                    <span className="text-[8.5px] font-mono text-muted-foreground/40 uppercase tracking-wide">
                                        {statusLabels[issue.status]}
                                    </span>
                                </div>

                                <span className="text-[8px] font-mono text-muted-foreground/20">·</span>

                                <div className="flex items-center gap-1">
                                    <span className={`size-1 rounded-full ${priorityColors[issue.priority]}`} />
                                    <span className="text-[8.5px] font-mono text-muted-foreground/40 uppercase tracking-wide">
                                        {priorityLabels[issue.priority]}
                                    </span>
                                </div>

                                {issue.dueDate && (
                                    <>
                                        <span className="text-[8px] font-mono text-muted-foreground/20">·</span>
                                        <div className="flex items-center gap-1">
                                            <Calendar className="size-2.5 text-muted-foreground/30" strokeWidth={1.5} />
                                            <span className="text-[8.5px] font-mono text-muted-foreground/40">
                                                {formatDate(issue.dueDate)}
                                            </span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Arrow indicator */}
                        <ArrowRight
                            className="size-3.5 text-muted-foreground/20 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-1"
                            strokeWidth={1.8}
                        />
                    </button>
                ))}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-4 py-1.5 border-t border-border/40 bg-sidebar/20">
                <span className="text-[8px] font-mono tracking-[0.1em] text-muted-foreground/20 uppercase">
                    Sheet 01 / 01
                </span>
                <div className="flex items-center gap-2 text-[8px] font-mono text-muted-foreground/20">
                    <span>v2.0.1</span>
                    <span className="w-px h-2 bg-border/30" />
                    <span>devflow.app</span>
                </div>
            </div>
        </div>
    );
};

export default SearchDropdown;