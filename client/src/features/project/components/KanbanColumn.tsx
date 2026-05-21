import { useDroppable } from "@dnd-kit/react";
import type { IssueType, KanbanColumnType } from "../../types"
import IssueCard from "./IssueCard";

type KanbanColumnProps = {
    column: KanbanColumnType,
    issues: IssueType[]
};

const statusColorMap: Record<string, { dot: string; header: string }> = {
    'TODO': { dot: 'bg-status-todo', header: 'from-status-todo/10 to-status-todo/5' },
    'INPROGRESS': { dot: 'bg-status-progress', header: 'from-status-progress/10 to-status-progress/5' },
    'INREVIEW': { dot: 'bg-status-review', header: 'from-status-review/10 to-status-review/5' },
    'DONE': { dot: 'bg-status-done', header: 'from-status-done/10 to-status-done/5' }
};


const KanbanColumn = ({ column, issues }: KanbanColumnProps) => {

    const colors = statusColorMap[column.id];
    const { ref, isDropTarget } = useDroppable({
        id: column.id
    })
    return (
        <div
            ref={ref}
            style={{ background: isDropTarget ? 'rgba(99,102,241,0.05)' : undefined }}
            className="w-full"
        >
            {/* Column Container */}
            <div className={`bg-linear-to-r ${colors.header} rounded-lg border border-border/50 px-3 py-2 mb-3`}>
                <div className="flex items-center gap-2 mb-0.5">
                    <div className={`w-2 h-2 rounded-full ${colors.dot}`} />
                    <h2 className="font-semibold text-foreground text-xs">
                        {column.title}
                    </h2>
                </div>
                <p className="text-xs text-muted-foreground ml-4">
                    {issues.length} {issues.length === 1 ? 'issue' : 'issues'}
                </p>
            </div>

            {/* Issues Container */}
            <div className="flex-1 flex flex-col gap-2 overflow-y-auto">
                {issues.length > 0 ? (
                    issues.map((issue) => (
                        <IssueCard
                            key={issue.id}
                            id={issue.id}
                            description={issue.description}
                            priority={issue.priority}
                            status={issue.status}
                            title={issue.title}
                        />
                    ))
                ) : (
                    <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-border/30 py-8">
                        <p className="text-xs text-muted-foreground/50">No issues yet</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default KanbanColumn