import { useParams } from "react-router"
import { useCurrentWorkspace } from "../../workspace/query/useCurrentWorkspace";
import { useCurrentProject } from "../query/useCurrentProject";
import { useIssuesInCurrentProject } from "../query/useIssuesInCurrentProject";
import type { IssueType, KanbanColumnType } from "../../types";
import { DragDropProvider, type DragEndEvent } from "@dnd-kit/react";
import KanbanColumn from "./KanbanColumn";


export const KanbanComponent = () => {
    const { projectSlug, workspaceSlug } = useParams();
    const { data: workspaceData, isPending: isWorkspacePending } = useCurrentWorkspace(workspaceSlug!);
    const { data: projectData, isPending: isProjectPending } = useCurrentProject(projectSlug!, workspaceData?.data?.id!);
    const { data: issuesData, isPending: areIssuesPending } = useIssuesInCurrentProject(workspaceData?.data?.id!, projectData?.data?.id!);
    if (isWorkspacePending || isProjectPending || areIssuesPending) {
        return <div className="flex items-center justify-center h-96">
            <div className="text-muted-foreground">Loading issues...</div>
        </div>
    };

    const columns: KanbanColumnType[] = [
        { id: 'TODO', title: 'To Do' },
        { id: 'INPROGRESS', title: 'In Progress' },
        { id: 'INREVIEW', title: 'In Review' },
        { id: 'DONE', title: 'Done' }
    ];

    const issues: IssueType[] = issuesData?.data!;

    const handleDragEnd = (event: DragEndEvent) => {
        const { source, target } = event.operation;

        if (!source || !target || event.canceled) return;

        console.log(`Dropped ${source.id} onto ${target.id}`);
        // TODO: Call your PATCH API here
        // updateIssueStatus(issueId, newStatus);
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
                            <KanbanColumn key={column.id} column={column} issues={columnIssues} />
                        );
                    })}
                </DragDropProvider>
            </div>
        </div >
    )
}