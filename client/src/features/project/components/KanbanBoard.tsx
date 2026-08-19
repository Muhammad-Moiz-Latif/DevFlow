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
import { Loader2, Radio, Activity } from "lucide-react";

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
        return (
            <div className="flex items-center justify-center h-[70vh]">
                <div className="flex items-center gap-3 border border-border/60 bg-card/80 backdrop-blur-sm px-5 py-3.5 rounded-md shadow-sm">
                    <Loader2 className="size-4 animate-spin text-primary" />
                    <span className="text-[12px] font-mono tracking-wide text-muted-foreground/70">
                        Loading board…
                    </span>
                </div>
            </div>
        );
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
        if (now - lastDragMoveEmitAt.current < 75) return;
        lastDragMoveEmitAt.current = now;
        socket.emit('on-drag-move', { sourceId: source.id, targetId: target?.id });
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { source, target } = event.operation;
        if (socket) socket.emit('on-drag-end');
        if (!source || !target || event.canceled || source.id === target.id) return;
        const sourceIssue = issues.find((issue) => issue.id === source.id);
        if (!sourceIssue) return;
        const targetStatus: IssueStatus | undefined = isSortable(target)
            ? (issues.find((issue) => issue.id === target.id)?.status as IssueStatus | undefined)
            : COLUMN_STATUSES.includes(target.id as IssueStatus)
                ? (target.id as IssueStatus)
                : undefined;
        if (!targetStatus) return;
        const sameColumn = sourceIssue.status === targetStatus;
        const columnIssues = issues
            .filter((issue) => issue.status === targetStatus && issue.id !== source.id)
            .sort((a, b) => a.order - b.order);
        let insertIndex: number;
        if (isSortable(target)) {
            insertIndex = target.index;
        } else {
            insertIndex = columnIssues.length;
        }
        insertIndex = Math.max(0, Math.min(insertIndex, columnIssues.length));
        let newOrderValue: number;
        if (columnIssues.length === 0) {
            newOrderValue = 1;
        } else if (insertIndex === 0) {
            newOrderValue = columnIssues[0].order / 2;
        } else if (insertIndex >= columnIssues.length) {
            newOrderValue = columnIssues[columnIssues.length - 1].order + 1;
        } else {
            const previousIssue = columnIssues[insertIndex - 1];
            const nextIssue = columnIssues[insertIndex];
            newOrderValue = (previousIssue.order + nextIssue.order) / 2;
        }
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

    const totalIssues = issues.length;
    const doneCount = issues.filter(i => i.status === "DONE").length;
    const progressPct = totalIssues > 0 ? Math.round((doneCount / totalIssues) * 100) : 0;

    return (
        <div className="flex flex-col p-4 md:p-6">
            {/* ── DRAFTING SHEET CONTAINER ── */}
            <div className="relative flex flex-col border border-border/60 bg-background/40 overflow-hidden rounded-md">

                {/* Grid overlay */}
                <div
                    className="absolute inset-0 opacity-[0.025] pointer-events-none"
                    style={{
                        backgroundImage: `
                            linear-gradient(oklch(1 0 0 / 1) 1px, transparent 1px),
                            linear-gradient(90deg, oklch(1 0 0 / 1) 1px, transparent 1px)
                        `,
                        backgroundSize: "40px 40px",
                    }}
                />

                {/* Registration marks */}
                {[
                    "top-3 left-3 border-t border-l",
                    "top-3 right-3 border-t border-r",
                    "bottom-3 left-3 border-b border-l",
                    "bottom-3 right-3 border-b border-r",
                ].map((pos) => (
                    <div
                        key={pos}
                        className={`absolute ${pos} size-2.5 border-primary/30 pointer-events-none`}
                    />
                ))}

                {/* ── HEADER ── */}
                <div className="relative shrink-0 border-b border-border/60 bg-sidebar/90">
                    {/* Top metadata bar */}
                    <div className="h-8 border-b border-border/40 flex items-center px-4 gap-3 font-mono text-[9.5px] tracking-wide text-muted-foreground/70">
                        <span className="text-foreground/50">PROJECT</span>
                        <span className="text-foreground/80 uppercase truncate max-w-[200px]">
                            {projectData?.data?.name || 'Untitled'}
                        </span>
                        <span className="w-px h-2.5 bg-border" />
                        <span className="hidden sm:inline">SCALE 1:1</span>
                        <span className="w-px h-2.5 bg-border hidden sm:inline" />
                        <span className="hidden sm:inline">REV A</span>
                        <span className="w-px h-2.5 bg-border hidden sm:inline" />
                        <span className="hidden md:inline-flex items-center gap-1.5 text-primary/80">
                            <Radio className="size-2.5" />
                            LIVE
                        </span>

                        <div className="ml-auto flex items-center gap-4">
                            {/* Progress instrument */}
                            <div className="hidden sm:flex items-center gap-2">
                                <Activity className="size-2.5 text-muted-foreground/50" />
                                <span className="text-[9px] tabular-nums">{progressPct}% COMPLETE</span>
                                <div className="w-16 h-1 bg-border/60 overflow-hidden rounded-full">
                                    <div
                                        className="h-full bg-primary/60 transition-all duration-500 rounded-full"
                                        style={{ width: `${progressPct}%` }}
                                    />
                                </div>
                            </div>
                            <span className="text-muted-foreground/40 text-[8px]">
                                {workspaceSlug}/{projectSlug}
                            </span>
                        </div>
                    </div>

                    {/* Main header content */}
                    <div className="px-4 py-3 flex items-center justify-between">
                        <div className="flex items-baseline gap-3">
                            <div className="inline-flex items-center gap-3 text-[10px] font-mono tracking-[0.16em] text-muted-foreground/50 uppercase">
                                <span className="w-4 h-px bg-border" />
                                Board
                                <span className="w-4 h-px bg-border" />
                            </div>
                            <h1 className="text-lg font-semibold tracking-tight text-foreground/90">
                                {projectData?.data?.name || 'Project'}
                            </h1>
                            <span className="text-[10px] font-mono text-muted-foreground/40 tabular-nums hidden sm:inline">
                                {totalIssues} issues
                            </span>
                        </div>

                        {/* Presence instrument cluster */}
                        <div className="flex items-center gap-3">
                            {onlineUsers && onlineUsers.length > 0 && (
                                <div className="flex items-center gap-2 px-2.5 py-1.5 border border-border/50 bg-background/60 rounded">
                                    <div className="flex -space-x-1.5">
                                        {onlineUsers.slice(0, 4).map((u) => (
                                            <img
                                                key={u.id}
                                                src={u.img}
                                                alt={u.username}
                                                className="size-5 rounded-full ring-1 ring-background object-cover"
                                            />
                                        ))}
                                        {onlineUsers.length > 4 && (
                                            <span className="size-5 rounded-full bg-border/80 ring-1 ring-background flex items-center justify-center text-[8px] font-mono text-foreground/60">
                                                +{onlineUsers.length - 4}
                                            </span>
                                        )}
                                    </div>
                                    <span className="text-[9.5px] font-mono text-muted-foreground/60 tracking-wide">
                                        {onlineUsers.length} ACTIVE
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                </div>

                {/* ── LIVE CURSORS ── */}
                <LiveCursors combinedUsers={combinedUsers} currentSocketId={socket?.id!} />

                {/* ── KANBAN BOARD ── */}
                <div className="relative">
                    <DragDropProvider
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                        onDragMove={handleDragMove}
                    >
                        <div className="flex gap-px bg-border/60 overflow-x-auto">
                            {columns.map((column) => {
                                const columnIssues = issues.filter(issue => issue.status === column.id);
                                return (
                                    <div
                                        key={column.id}
                                        className="flex-1 min-w-[220px] max-w-[25%] bg-background/40 flex flex-col"
                                    >

                                        <div className="p-2 space-y-1.5">
                                            <KanbanColumn
                                                column={column}
                                                issues={columnIssues}
                                                workspaceId={workspaceData?.data?.id!}
                                                projectId={projectData?.data?.id!}
                                                yourRole={workspaceData?.data?.yourRole}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Remote drag ghosts */}
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
                                <div className="mb-2 inline-flex items-center gap-2 border border-primary/40 bg-background px-2.5 py-1 text-[10px] font-mono font-medium text-primary">
                                    <span
                                        className="size-3 rounded-full bg-cover bg-center ring-1 ring-primary/20"
                                        style={{ backgroundImage: `url(${ghost.img})` }}
                                    />
                                    {ghost.username}
                                    <span className="text-primary/50">·</span>
                                    <span className="text-[9px] uppercase tracking-wider">Dragging</span>
                                </div>
                                <div className="scale-[0.92] opacity-90 shadow-md ring-1 ring-primary/30">
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

                        {/* Local drag overlay */}
                        <DragOverlay>
                            {activeIssue ? (
                                <div className="relative opacity-100 rotate-1 scale-[1.02] transition-transform shadow-lg cursor-grabbing ring-1 ring-primary/40">
                                    <div className="absolute -top-6 left-0 right-0 flex justify-center">
                                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-primary text-primary-foreground text-[9px] font-mono tracking-wider uppercase">
                                            Moving
                                        </span>
                                    </div>
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

                {/* ── BOTTOM RULER ── */}
                <div className="relative shrink-0 h-6 border-t border-border/40 bg-sidebar/30 flex items-center px-4 gap-1 overflow-hidden">
                    <span className="text-[8px] font-mono text-muted-foreground/30 tracking-widest">0</span>
                    {Array.from({ length: 30 }).map((_, i) => {
                        const tickPct = (i / 29) * 100;
                        const isPastProgress = tickPct <= progressPct;
                        return (
                            <div key={i} className="flex-1 flex justify-center">
                                <div
                                    className={isPastProgress ? "bg-primary/70" : "bg-border/40"}
                                    style={{
                                        width: "1px",
                                        height: i % 10 === 0 ? "10px" : i % 5 === 0 ? "6px" : "3px",
                                    }}
                                />
                            </div>
                        );
                    })}
                    <span className="text-[8px] font-mono text-muted-foreground/30 tracking-widest">100</span>
                    <span className="ml-2 text-[8px] font-mono text-primary/70 tracking-widest tabular-nums">
                        {progressPct}%
                    </span>
                </div>
            </div>
        </div>
    )
}