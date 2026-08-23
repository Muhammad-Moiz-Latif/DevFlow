// issue-detail-drawer.tsx
import { X, Calendar, Tag, Layers, MessageSquare, AlertCircle, ArrowLeft } from "lucide-react";
import { useAuthStore } from "../../../stores/auth-store";

interface IssueDetailDrawerProps {
    issue: {
        id: string;
        title: string;
        description?: string;
        priority: 'URGENT' | 'HIGH' | 'MEDIUM' | 'LOW';
        status: 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE';
        project?: {
            id: string;
            name: string;
        };
        createdAt?: Date | string;
        updatedAt?: Date | string;
        dueDate?: Date | string | null;
        order?: number;
        labels?: string[];
        key?: string;
    } | null;
    onClose: () => void;
    isOpen: boolean;
}

// Helper to format dates
const formatDate = (dateString?: Date | string | null) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return null;
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
};

const formatDateWithTime = (dateString?: Date | string | null) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return null;
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

export function IssueDetailDrawer({ issue, onClose, isOpen }: IssueDetailDrawerProps) {
    const { user } = useAuthStore();

    if (!issue) return null;

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

    const priorityLabels = {
        URGENT: 'Urgent',
        HIGH: 'High',
        MEDIUM: 'Medium',
        LOW: 'Low',
    };

    const statusLabels = {
        TODO: 'To Do',
        IN_PROGRESS: 'In Progress',
        IN_REVIEW: 'In Review',
        DONE: 'Done',
    };

    const priorityIcons = {
        URGENT: <AlertCircle className="size-3.5 text-destructive" strokeWidth={2.5} />,
        HIGH: <AlertCircle className="size-3.5 text-orange-500" strokeWidth={2} />,
        MEDIUM: <AlertCircle className="size-3.5 text-yellow-500" strokeWidth={1.8} />,
        LOW: <AlertCircle className="size-3.5 text-blue-400" strokeWidth={1.5} />,
    };

    return (
        <>
            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity duration-300"
                    onClick={onClose}
                />
            )}

            {/* Drawer */}
            <div
                className={`
                    fixed right-0 top-0 h-full w-full sm:w-[480px] md:w-[560px] 
                    bg-background border-l border-border shadow-2xl z-50 
                    transition-transform duration-300 ease-out
                    ${isOpen ? 'translate-x-0' : 'translate-x-full'}
                `}
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-border px-5 h-14 shrink-0">
                    <div className="flex items-center gap-3 min-w-0">
                        <button
                            onClick={onClose}
                            className="p-1 hover:bg-surface rounded-md transition-colors text-muted-foreground hover:text-foreground"
                        >
                            <ArrowLeft className="size-4" />
                        </button>
                        <div className="flex items-center gap-2.5 min-w-0">
                            <span className="text-[10px] font-mono text-muted-foreground/60 bg-border/40 px-2 py-0.5 rounded">
                                {issue.key || issue.id.slice(0, 8).toUpperCase()}
                            </span>
                            <div className="flex items-center gap-1.5">
                                <span className={`size-1.5 rounded-full ${priorityColors[issue.priority]}`} />
                                <span className={`size-1.5 rounded-full ${statusColors[issue.status]}`} />
                            </div>
                            {issue.order !== undefined && (
                                <span className="text-[9px] font-mono text-muted-foreground/30">
                                    #{issue.order}
                                </span>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 hover:bg-surface rounded-md transition-colors text-muted-foreground hover:text-foreground"
                    >
                        <X className="size-4" />
                    </button>
                </div>

                {/* Content */}
                <div className="h-[calc(100%-56px)] overflow-y-auto p-5 space-y-5">
                    {/* Title */}
                    <div>
                        <h2 className="text-[1.15rem] font-semibold tracking-[-0.02em] leading-snug text-foreground">
                            {issue.title}
                        </h2>
                    </div>

                    {/* Metadata grid */}
                    <div className="grid grid-cols-2 gap-3 bg-surface/30 rounded-lg p-3.5 border border-border/40">
                        <div className="space-y-0.5">
                            <label className="text-[9px] font-mono tracking-[0.08em] text-muted-foreground/40 uppercase">
                                Status
                            </label>
                            <div className="flex items-center gap-1.5">
                                <span className={`size-1.5 rounded-full ${statusColors[issue.status]}`} />
                                <span className="text-[12px] font-medium capitalize">
                                    {statusLabels[issue.status]}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-0.5">
                            <label className="text-[9px] font-mono tracking-[0.08em] text-muted-foreground/40 uppercase">
                                Priority
                            </label>
                            <div className="flex items-center gap-1.5">
                                {priorityIcons[issue.priority]}
                                <span className={`text-[12px] font-medium ${issue.priority === 'URGENT' ? 'text-destructive' : ''}`}>
                                    {priorityLabels[issue.priority]}
                                </span>
                            </div>
                        </div>

                        {/* Assignee - using authenticated user */}
                        <div className="space-y-0.5">
                            <label className="text-[9px] font-mono tracking-[0.08em] text-muted-foreground/40 uppercase">
                                Assignee
                            </label>
                            <div className="flex items-center gap-2">
                                {user ? (
                                    <>
                                        {user.image ? (
                                            <img
                                                src={user.image}
                                                alt={user.username || 'User'}
                                                className="size-5 rounded-full object-cover shrink-0"
                                            />
                                        ) : (
                                            <div className="size-5 rounded-full bg-gradient-to-br from-sky-400 to-indigo-600 flex items-center justify-center text-[8px] font-mono text-white shrink-0">
                                                {user.username?.charAt(0).toUpperCase() || '?'}
                                            </div>
                                        )}
                                        <span className="text-[12px] truncate">
                                            {user.username || 'You'}
                                        </span>
                                    </>
                                ) : (
                                    <span className="text-[12px] text-muted-foreground/50">You</span>
                                )}
                            </div>
                        </div>

                        <div className="space-y-0.5">
                            <label className="text-[9px] font-mono tracking-[0.08em] text-muted-foreground/40 uppercase">
                                Project
                            </label>
                            <div className="flex items-center gap-1.5">
                                <Layers className="size-3 text-muted-foreground/40" strokeWidth={1.5} />
                                <span className="text-[12px] truncate">{issue.project?.name || 'Uncategorized'}</span>
                            </div>
                        </div>

                        {/* Due Date */}
                        {issue.dueDate && (
                            <div className="col-span-2 space-y-0.5">
                                <label className="text-[9px] font-mono tracking-[0.08em] text-muted-foreground/40 uppercase">
                                    Due Date
                                </label>
                                <div className="flex items-center gap-1.5">
                                    <Calendar className="size-3 text-muted-foreground/40" strokeWidth={1.5} />
                                    <span className="text-[12px]">{formatDate(issue.dueDate)}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Description */}
                    {issue.description && (
                        <div className="space-y-1.5">
                            <label className="text-[9px] font-mono tracking-[0.08em] text-muted-foreground/40 uppercase flex items-center gap-2">
                                <MessageSquare className="size-3" strokeWidth={1.5} />
                                Description
                            </label>
                            <div className="bg-surface/30 border border-border/40 rounded-lg p-3.5">
                                <p className="text-[12.5px] leading-relaxed text-foreground/80 whitespace-pre-wrap break-words">
                                    {issue.description}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Labels */}
                    {issue.labels && issue.labels.length > 0 && (
                        <div className="space-y-1.5">
                            <label className="text-[9px] font-mono tracking-[0.08em] text-muted-foreground/40 uppercase flex items-center gap-2">
                                <Tag className="size-3" strokeWidth={1.5} />
                                Labels
                            </label>
                            <div className="flex items-center gap-1.5 flex-wrap">
                                {issue.labels.map((label: string) => (
                                    <span
                                        key={label}
                                        className="text-[9px] font-mono bg-border/30 px-2 py-0.5 rounded-md text-foreground/70 border border-border/40"
                                    >
                                        {label}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Dates */}
                    <div className="pt-4 border-t border-border/50">
                        <div className="flex items-center justify-between text-[9px] font-mono tracking-[0.08em] text-muted-foreground/30 uppercase">
                            <div className="flex items-center gap-3">
                                <span>Issue #{issue.order || 'N/A'}</span>
                                <span className="w-px h-2.5 bg-border/40" />
                                <span>{issue.id.slice(0, 8).toUpperCase()}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                {issue.createdAt && (
                                    <span>Created {formatDateWithTime(issue.createdAt)}</span>
                                )}
                                {issue.updatedAt && issue.updatedAt !== issue.createdAt && (
                                    <>
                                        <span className="w-px h-2.5 bg-border/40" />
                                        <span>Updated {formatDateWithTime(issue.updatedAt)}</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}