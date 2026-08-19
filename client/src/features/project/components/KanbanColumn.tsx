import { useState } from "react";
import { useDroppable } from "@dnd-kit/react";
import { Plus, Layers } from "lucide-react";
import type { IssueType, KanbanColumnType } from "../../types"
import IssueCard from "./IssueCard";
import { IssueDrawer } from "./IssueDrawer";
import CreateIssueModal from "./CreateIssueModal";

type KanbanColumnProps = {
    column: KanbanColumnType,
    issues: IssueType[],
    workspaceId: string,
    projectId: string,
    yourRole: 'ADMIN' | 'MEMBER' | 'VIEWER' | undefined
    currentSocketId?: string
};

const statusColorMap: Record<string, { dot: string; border: string; bg: string }> = {
    'TODO': {
        dot: 'bg-status-todo',
        border: 'border-status-todo/25',
        bg: 'bg-status-todo/5'
    },
    'IN_PROGRESS': {
        dot: 'bg-status-progress',
        border: 'border-status-progress/25',
        bg: 'bg-status-progress/5'
    },
    'IN_REVIEW': {
        dot: 'bg-status-review',
        border: 'border-status-review/25',
        bg: 'bg-status-review/5'
    },
    'DONE': {
        dot: 'bg-status-done',
        border: 'border-status-done/25',
        bg: 'bg-status-done/5'
    }
};

const KanbanColumn = ({ column, issues, workspaceId, projectId, yourRole }: KanbanColumnProps) => {
    const [selectedIssue, setSelectedIssue] = useState<IssueType | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const colors = statusColorMap[column.id];
    const canCreate = yourRole !== 'VIEWER';
    const { ref, isDropTarget } = useDroppable({
        id: column.id
    });

    return (
        <>
            <div
                ref={ref}
                aria-disabled={true}
                className={`w-full min-h-[calc(100vh-320px)] flex flex-col transition-colors ${isDropTarget ? "bg-primary/5" : ""
                    }`}
            >
                {/* Column header - clean and minimal */}
                <div className="flex items-center gap-2.5 px-1 py-2.5 border-b border-border/40">
                    <div className={`size-1.5 rounded-full ${colors.dot}`} />
                    <h2 className="text-[11px] font-semibold text-foreground/80 tracking-tight uppercase">
                        {column.title}
                    </h2>
                    {/* Count as a subtle pill badge */}
                    <span className="ml-auto flex items-center justify-center min-w-4.5 h-4.5 px-1.5 rounded-full bg-border/50 text-[9px] font-mono font-medium text-muted-foreground tabular-nums">
                        {issues.length}
                    </span>
                </div>

                {/* Add issue button - in original position */}
                {canCreate && (
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="mx-0 mt-2 flex items-center justify-center gap-1.5 py-1.5 border border-dashed border-white/10 hover:cursor-pointer hover:border-border/60 text-[10px] font-mono uppercase tracking-wide text-muted-foreground/40 hover:text-foreground hover:bg-surface/20 transition-colors shrink-0 rounded-sm"
                    >
                        <Plus className="size-3.5" strokeWidth={1.8} />
                        Add issue
                    </button>
                )}

                {/* Issues */}
                <div className={`flex-1 flex flex-col gap-1.5 pt-2 overflow-y-auto ${yourRole === 'VIEWER' ? "pointer-events-none" : ""
                    }`}>
                    {issues.length > 0 ? (
                        issues.map((issue, index) => (
                            <IssueCard
                                key={issue.id}
                                id={issue.id}
                                description={issue.description}
                                priority={issue.priority}
                                status={issue.status}
                                title={issue.title}
                                dueDate={issue.dueDate}
                                assignedTo={issue.assignee}
                                index={index}
                                onClick={() => setSelectedIssue(issue)}
                            />
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-10 gap-2">
                            <div className={`size-8 rounded-full ${colors.bg} border ${colors.border} flex items-center justify-center`}>
                                <Layers className="size-4 text-muted-foreground/30" strokeWidth={1.5} />
                            </div>
                            <p className="text-[11px] text-muted-foreground/40 font-medium tracking-tight">
                                No issues yet
                            </p>
                            {canCreate && (
                                <button
                                    onClick={() => setIsCreateModalOpen(true)}
                                    className="text-[10px] font-mono text-primary/50 hover:text-primary/80 transition-colors"
                                >
                                    + Create one
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {selectedIssue && (
                <IssueDrawer issue={selectedIssue} onClose={() => setSelectedIssue(null)} />
            )}
            {isCreateModalOpen && (
                <CreateIssueModal
                    workspaceId={workspaceId}
                    projectId={projectId}
                    status={column.id as 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE'}
                    setIsCreateModalOpen={setIsCreateModalOpen}
                />
            )}
        </>
    )
}

export default KanbanColumn