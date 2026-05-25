import { useParams } from "react-router"
import { useCurrentWorkspace } from "../../workspace/query/useCurrentWorkspace";
import { useCurrentProject } from "../query/useCurrentProject";
import { useIssuesInCurrentProject } from "../query/useIssuesInCurrentProject";
import type { IssueType, KanbanColumnType, MyIssueType } from "../../types";
import { DragDropProvider, type DragEndEvent } from "@dnd-kit/react";
import { isSortable } from '@dnd-kit/react/sortable';
import KanbanColumn from "./KanbanColumn";
import { useUpdateIssue } from "../../issue/queries/useUpdateIssue";


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

        // get filtered and sorted issues of the target column
        const columnIssues = issuesData?.data!
            .filter((issue) => issue.status === target.id)
            .sort((a, b) => a.order - b.order);

        // handle empty column
        let newOrderValue = 0;


        // get the index within the target column where the card landed
        let requiredIndex = {
            value: 0,
            sameColumn: true
        };

        if (isSortable(target)) {
            requiredIndex.value = target.index;
            requiredIndex.sameColumn = false;
        } else if (isSortable(source)) {
            requiredIndex.value = source.index;
        };

        if (!columnIssues || columnIssues.length === 0) {
            newOrderValue = 1;
            mutate({
                id: source.id as string,
                status: target.id as "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE",
                order: newOrderValue
            });
            return;
        };

        if (columnIssues![requiredIndex.value].id === source.id) return;

        const previous_issue = columnIssues![requiredIndex.value - 1] || null;
        const next_issue = columnIssues![requiredIndex.sameColumn ? requiredIndex.value + 1 : requiredIndex.value] || null;


        // dropped at the very top
        if (!previous_issue && next_issue) {
            newOrderValue = next_issue.order / 2;
        }
        // dropped at the very bottom
        else if (!next_issue && previous_issue) {
            newOrderValue = previous_issue.order + 1;
        }
        // dropped in the middle
        else if (previous_issue && next_issue) {
            newOrderValue = (previous_issue.order + next_issue.order) / 2;
        }
        console.log(columnIssues)
        console.log('source:', source.id);
        console.log('target:', target.id);
        console.log('requiredIndex:', requiredIndex.value);
        console.log('previous:', previous_issue);
        console.log('next:', next_issue);
        console.log('newOrderValue:', newOrderValue);

        // TODO: PATCH request goes here
        mutate({
            id: source.id as string,
            status: target.id as "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE",
            order: newOrderValue
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
                            <KanbanColumn key={column.id} column={column} issues={columnIssues} />
                        );
                    })}
                </DragDropProvider>
            </div>
        </div >
    )
}