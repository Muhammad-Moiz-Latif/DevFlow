import { useParams } from "react-router"
import { useCurrentWorkspace } from "../../workspace/query/useCurrentWorkspace";
import { useCurrentProject } from "../query/useCurrentProject";
import { useIssuesInCurrentProject } from "../query/useIssuesInCurrentProject";
import type { IssueType, KanbanColumnType, MyIssueType } from "../../types";
import { DragDropProvider, DragOverlay, type DragEndEvent, type DragMoveEvent, type DragStartEvent } from "@dnd-kit/react";
import { isSortable } from '@dnd-kit/react/sortable';
import KanbanColumn from "./KanbanColumn";
import { useUpdateIssue } from "../../issue/queries/useUpdateIssue";
import { useOnlinePresence } from "../query/useOnlinePresense";
import { useLiveCursors } from "../query/useLiveCursors";
import { LiveCursors } from "./LiveCursors";
import { useSocket } from "../../../context/socketContext";
import { useKanbanRoom } from "../query/useKanbanRoom";
import { useEffect, useRef, useState } from "react";
import IssueCard from "./IssueCard";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../../../stores/auth-store";

type IssueStatus = "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE";
type DragDropType = {
    socketId: string,
    sourceId: string,
    targetId: string | 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE'
};

const COLUMN_STATUSES: IssueStatus[] = ["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"];

export const KanbanComponent = () => {
    const { projectSlug, workspaceSlug } = useParams();
    const socket = useSocket();
    const { user } = useAuthStore();
    const [activeIssue, setActiveIssue] = useState<IssueType | null>(null);
    const { data: workspaceData, isPending: isWorkspacePending } = useCurrentWorkspace(workspaceSlug!);
    const { data: projectData, isPending: isProjectPending } = useCurrentProject(projectSlug!, workspaceData?.data?.id!);
    const { mutate } = useUpdateIssue(workspaceData?.data?.id!, projectData?.data?.id!);
    const { data: issuesData, isPending: areIssuesPending } = useIssuesInCurrentProject(workspaceData?.data?.id!, projectData?.data?.id!);
    useKanbanRoom(projectData?.data?.id!);
    const onlineUsers = useOnlinePresence(projectData?.data?.id!);
    const userCoordinates = useLiveCursors(projectData?.data?.id!);
    const [dragDropEvents, setDragDropEvents] = useState<DragDropType[]>([]);
    const queryClient = useQueryClient();
    const lastDragMoveEmitAt = useRef(0);
    const combinedUsers = userCoordinates
        .filter((user) => onlineUsers.some((online) => online.socketId === user.socketId))
        .map((user) => {
            const presenceData = onlineUsers.find((online) => online.socketId === user.socketId)!;
            return { ...presenceData, x: user.x, y: user.y };
        });

    const dragGhosts = dragDropEvents
        .filter((dragEvent) => dragEvent.socketId !== socket?.id)
        .map((dragEvent) => {
            const user = onlineUsers.find((onlineUser) => onlineUser.socketId === dragEvent.socketId);
            const coordinates = userCoordinates.find((coordinateUser) => coordinateUser.socketId === dragEvent.socketId);
            const issue = issuesData?.data?.find((item) => item.id === dragEvent.sourceId);

            if (!issue || !coordinates) {
                return null;
            }

            return {
                ...dragEvent,
                username: user?.username ?? 'Someone',
                img: user?.img ?? '',
                x: coordinates.x,
                y: coordinates.y,
                issue,
            };
        })
        .filter(Boolean) as Array<DragDropType & {
            username: string;
            img: string;
            x: number;
            y: number;
            issue: IssueType;
        }>;

    useEffect(() => {
        if (!socket) return;

        const handleDragDropData = (data: DragDropType[]) => {
            setDragDropEvents(data);
        };

        socket.on('update:drag-drop-event', handleDragDropData);

        return () => {
            socket.off('update:drag-drop-event', handleDragDropData);
        };
    }, [socket]);

    // listening for any live issue updates
    useEffect(() => {
        if (!socket) return;

        const handleLiveIssueUpdate = (update_issue: MyIssueType) => {
            queryClient.setQueryData(['all-issues', user?._id, workspaceData?.data?.id, projectData?.data?.id], (oldData: { success: boolean, message: string, data: MyIssueType[] }) => {
                return {
                    ...oldData,
                    data: oldData.data.map((issue) => {
                        return issue.id === update_issue.id ? update_issue : issue
                    })
                }
            });
        };

        socket.on("update:issue", handleLiveIssueUpdate);

        return () => {
            socket.off("update:issue", handleLiveIssueUpdate)
        }
    }, [socket])


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

    const handleDragStart = (event: DragStartEvent) => {
        const { source, target } = event.operation;
        if (!source) return;
        // Find the full issue data based on the ID we just picked up
        const draggedIssue = issues.find((issue) => issue.id === source.id);
        if (draggedIssue) {
            setActiveIssue(draggedIssue);
        };
        if (!socket) return;

        socket.emit('on-drag-start', { sourceId: source.id, targetId: target?.id });

    };

    const handleDragMove = (event: DragMoveEvent) => {
        const { source, target } = event.operation;

        if (!socket || !source) return;

        const now = Date.now();
        if (now - lastDragMoveEmitAt.current < 75) {
            return;
        }

        lastDragMoveEmitAt.current = now;

        socket.emit('on-drag-move', { sourceId: source.id, targetId: target?.id });

    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { source, target } = event.operation;

        if (socket) socket.emit('on-drag-end');

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

        setActiveIssue(null);

        if (!socket) return;

        socket.emit('on-drag-end', ({ sourceId: source.id, targetId: target.id }));

    };

    console.log(onlineUsers)

    return (
        <div className="flex flex-col h-full p-4">
            {/* Header */}
            <div className="mb-4 flex justify-between items-center">
                <div>
                    <p className="text-xs text-muted-foreground mb-0.5">Projects</p>
                    <h1 className="text-2xl font-bold text-foreground">{projectData?.data?.name || 'Project'}</h1>
                </div>

                <div>
                    {onlineUsers?.length! > 0 && <div className="flex">{
                        onlineUsers?.map((user) => (
                            <img key={user.id} src={user.img} className="size-7 rounded-full" />
                        ))
                    }</div>}
                </div>
            </div>
            <LiveCursors combinedUsers={combinedUsers} currentSocketId={socket?.id!} />
            {/* Kanban Board */}
            <div className="flex gap-4 pb-2 flex-1 overflow-hidden">
                <DragDropProvider
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    onDragMove={handleDragMove}
                >
                    {columns.map((column) => {
                        const columnIssues = issues.filter(issue => issue.status === column.id);
                        return (
                            <KanbanColumn
                                key={column.id}
                                column={column}
                                issues={columnIssues}
                                workspaceId={workspaceData?.data?.id!}
                                projectId={projectData?.data?.id!}
                                yourRole={workspaceData?.data?.yourRole}
                            />
                        );
                    })}

                    {dragGhosts.map((ghost) => (
                        <div
                            key={ghost.socketId}
                            className="pointer-events-none fixed z-[9998]"
                            style={{
                                left: `${ghost.x}px`,
                                top: `${ghost.y}px`,
                                transform: 'translate(-50%, -50%)'
                            }}
                        >
                            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/90 px-2 py-1 text-[10px] font-medium text-muted-foreground shadow-lg backdrop-blur-sm">
                                <img src={ghost.img} alt={ghost.username} className="size-4 rounded-full" />
                                {ghost.username} dragging
                            </div>
                            <div className="scale-[0.94] opacity-95 shadow-2xl">
                                <IssueCard
                                    id={ghost.issue.id}
                                    title={ghost.issue.title}
                                    description={ghost.issue.description}
                                    status={ghost.issue.status}
                                    priority={ghost.issue.priority}
                                    dueDate={ghost.issue.dueDate}
                                    assignedTo={ghost.issue.assignee}
                                    index={0}
                                />
                            </div>
                        </div>
                    ))}

                    {/* --- ADD THE OVERLAY HERE --- */}
                    <DragOverlay>
                        {activeIssue ? (
                            <div className="opacity-100 rotate-2 scale-105 transition-transform shadow-2xl cursor-grabbing">
                                <IssueCard
                                    id={activeIssue.id}
                                    title={activeIssue.title}
                                    description={activeIssue.description}
                                    status={activeIssue.status}
                                    priority={activeIssue.priority}
                                    dueDate={activeIssue.dueDate}
                                    assignedTo={activeIssue.assignee}
                                    index={0}
                                />
                            </div>
                        ) : null}
                    </DragOverlay>
                </DragDropProvider>
            </div>
        </div >
    )
}