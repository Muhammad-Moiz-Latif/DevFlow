import { useParams } from "react-router"
import { useCurrentWorkspace } from "../../workspace/query/useCurrentWorkspace";
import { useCurrentProject } from "../query/useCurrentProject";
import { useIssuesInCurrentProject } from "../query/useIssuesInCurrentProject";
import type { IssueType, KanbanColumnType } from "../../types";
import { DragDropProvider, type DragEndEvent } from "@dnd-kit/react";
import { isSortable } from '@dnd-kit/react/sortable';
import KanbanColumn from "./KanbanColumn";
import { useUpdateIssue } from "../../issue/queries/useUpdateIssue";

type IssueStatus = "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE";
const COLUMN_STATUSES: IssueStatus[] = ["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"];

export const KanbanComponent = () => {
    const { projectSlug, workspaceSlug } = useParams();
    const { data: workspaceData, isPending: isWorkspacePending } = useCurrentWorkspace(workspaceSlug!);
    const { data: projectData, isPending: isProjectPending } = useCurrentProject(projectSlug!, workspaceData?.data?.id!);
    const { mutate } = useUpdateIssue(workspaceData?.data?.id!, projectData?.data?.id!);
    const { data: issuesData, isPending: areIssuesPending } = useIssuesInCurrentProject(workspaceData?.data?.id!, projectData?.data?.id!);
    if (isWorkspacePending || isProjectPending || areIssuesPending) {
        return <div className="flex items-center justify-center h-96">
            <div className="text-muted-foreground">Loading issues...</div>
        </div>
    };

    const columns: KanbanColumnType[] = [
        { id: 'TODO', title: 'To Do' },
        { id: 'IN_PROGRESS', title: 'In Progress' },
        { id: 'IN_REVIEW', title: 'In Review' },
        { id: 'DONE', title: 'Done' }
    ];

    const issues: IssueType[] = issuesData?.data!;


    const handleDragEnd = (event: DragEndEvent) => {
        const { source, target } = event.operation;
        if (!source || !target || event.canceled || source.id === target.id) return;
        const sourceIssue = issues.find((issue) => issue.id === source.id);
        if (!sourceIssue) return;
        // Resolve which column we're dropping into
        const targetStatus: IssueStatus | undefined = isSortable(target)
            ? (issues.find((issue) => issue.id === target.id)?.status as IssueStatus | undefined)
            : COLUMN_STATUSES.includes(target.id as IssueStatus)
                ? (target.id as IssueStatus)
                : undefined;
        if (!targetStatus) return;
        const sameColumn = sourceIssue.status === targetStatus;
        // Target column list without the dragged card (cache still has old status)
        const columnIssues = issues
            .filter((issue) => issue.status === targetStatus && issue.id !== source.id)
            .sort((a, b) => a.order - b.order);
        // Where the card landed in the target column
        let insertIndex: number;
        if (isSortable(target)) {
            insertIndex = target.index;
        } else {
            // Dropped on column background → append to bottom
            insertIndex = columnIssues.length;
        }
        insertIndex = Math.max(0, Math.min(insertIndex, columnIssues.length));
        let newOrderValue: number;
        if (columnIssues.length === 0) {
            newOrderValue = 1;
        } else if (insertIndex === 0) {
            // Top of column
            newOrderValue = columnIssues[0].order / 2;
        } else if (insertIndex >= columnIssues.length) {
            // Bottom of column
            newOrderValue = columnIssues[columnIssues.length - 1].order + 1;
        } else {
            // Between two cards
            const previousIssue = columnIssues[insertIndex - 1];
            const nextIssue = columnIssues[insertIndex];
            newOrderValue = (previousIssue.order + nextIssue.order) / 2;
        }
        // Same slot in same column — nothing to update
        //@ts-ignore
        if (sameColumn && isSortable(target) && source.index === target.index) return;
        mutate({
            id: source.id as string,
            status: targetStatus,
            order: newOrderValue,
        });
    };

    return (
        <div className="flex flex-col h-full p-4">
            {/* Header */}
            <div className="mb-4">
                <p className="text-xs text-muted-foreground mb-0.5">Projects</p>
                <h1 className="text-2xl font-bold text-foreground">{projectData?.data?.name || 'Project'}</h1>
            </div>

            {/* Kanban Board */}
            <div className="flex gap-4 pb-2 flex-1 overflow-hidden">
                <DragDropProvider
                    onDragEnd={handleDragEnd}
                >
                    {columns.map((column) => {
                        const columnIssues = issues.filter(issue => issue.status === column.id);
                        return (
                            <KanbanColumn key={column.id} column={column} issues={columnIssues} workspaceId={workspaceData?.data?.id!} projectId={projectData?.data?.id!} />
                        );
                    })}
                </DragDropProvider>
            </div>
        </div >
    )
}