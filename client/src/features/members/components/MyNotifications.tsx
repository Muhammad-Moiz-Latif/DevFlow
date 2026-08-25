// MyNotifications.tsx

import { useParams } from "react-router";
import { useCurrentWorkspace } from "../../workspace/query/useCurrentWorkspace";
import {
    NotificationRow,
    NOTIFICATION_GRID_COLS,
} from "./notificationRow";
import {
    Bell,
    Loader2,
    Inbox,
    CheckCheck,
} from "lucide-react";
import { useMyInfiniteNotifications } from "../query/useMyInfiniteNotifications";
import { useEffect, useMemo, useRef, useState } from "react";

export const MyNotifications = () => {
    const { workspaceSlug } = useParams();

    const { data: workspaceData } =
        useCurrentWorkspace(workspaceSlug!);

    const workspaceId = workspaceData?.data?.id ?? "";

    const {
        data: infiniteNotificationsData,
        fetchNextPage,
        hasNextPage,
        isPending,
        isFetchingNextPage,
    } = useMyInfiniteNotifications(workspaceId);

    const loadRef = useRef<HTMLDivElement | null>(null);

    const [filter, setFilter] = useState<"all" | "unread">("all");

    const notifications =
        infiniteNotificationsData?.pages.flatMap(
            (data) => data.data?.notifications ?? []
        ) ?? [];

    const unreadNotifications = useMemo(
        () => notifications.filter((notification) => !notification.isRead),
        [notifications]
    );

    const visibleNotifications =
        filter === "unread"
            ? unreadNotifications
            : notifications;

    /*
     * Infinite scrolling
     */
    useEffect(() => {
        if (!loadRef.current) return;

        const intersectionObserver = new IntersectionObserver(
            ([entry]) => {
                if (
                    entry.isIntersecting &&
                    hasNextPage &&
                    !isFetchingNextPage
                ) {
                    fetchNextPage();
                }
            },
            {
                threshold: 0.2,
            }
        );

        intersectionObserver.observe(loadRef.current);

        return () => intersectionObserver.disconnect();
    }, [
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    ]);

    /*
     * Loading state
     */
    if (isPending) {
        return (
            <div className="min-h-[calc(100vh-4rem)] px-5 py-8 md:px-8 lg:px-10">
                <div className="mx-auto max-w-6xl">
                    <div className="relative flex min-h-[65vh] items-center justify-center overflow-hidden border border-border/60 bg-card">
                        {/* Decorative corner marks */}
                        <div className="absolute left-3 top-3 h-3 w-3 border-l border-t border-primary/30" />
                        <div className="absolute right-3 top-3 h-3 w-3 border-r border-t border-primary/30" />


                        <div className="flex flex-col items-center gap-4">
                            <div className="relative flex size-12 items-center justify-center border border-border/70 bg-background">
                                <Bell
                                    className="size-5 text-primary/70"
                                    strokeWidth={1.5}
                                />

                                <span className="absolute -right-1 -top-1 size-2 bg-primary/70" />
                            </div>

                            <div className="text-center">
                                <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-muted-foreground/60">
                                    Activity / Inbox
                                </p>

                                <p className="mt-2 text-[13px] text-muted-foreground">
                                    Loading notifications
                                </p>
                            </div>

                            <Loader2
                                className="size-3.5 animate-spin text-primary/60"
                                strokeWidth={1.8}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-4rem)] px-5 py-7 md:px-8 lg:px-10">
            <div className="mx-auto max-w-6xl">

                {/* =====================================================
                    HEADER
                ====================================================== */}
                <header className="relative mb-8 border-b border-border/70 pb-7">

                    {/* Corner registration marks */}
                    <div className="absolute left-0 top-0 h-3 w-3 border-l border-t border-primary/40" />
                    <div className="absolute right-0 top-0 h-3 w-3 border-r border-t border-primary/40" />

                    <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">

                        {/* Heading */}
                        <div className="pl-3 mt-4">

                            <div className="mb-3 flex items-center gap-2.5 text-[10px] font-mono uppercase tracking-[0.18em] text-muted-foreground/60">
                                <span className="h-px w-5 bg-primary/50" />
                                Workspace activity
                            </div>

                            <div className="flex items-center gap-3">
                                <h1 className="text-[2rem] font-semibold leading-none tracking-[-0.045em] text-foreground md:text-[2.25rem]">
                                    Notifications
                                </h1>

                                {unreadNotifications.length > 0 && (
                                    <span className="flex size-6 items-center justify-center bg-primary text-[9px] font-mono font-medium text-primary-foreground">
                                        {unreadNotifications.length > 9
                                            ? "9+"
                                            : unreadNotifications.length}
                                    </span>
                                )}
                            </div>

                            <p className="mt-3 max-w-xl text-[13px] leading-relaxed text-muted-foreground/60">
                                A quiet record of everything that needs your
                                attention across this workspace.
                            </p>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center gap-6 border-l border-border/60 pl-5 md:pb-1">

                            <div>
                                <p className="text-[9px] font-mono uppercase tracking-[0.16em] text-muted-foreground/60">
                                    Total
                                </p>

                                <p className="mt-1 text-xl font-semibold tracking-tight">
                                    {notifications.length}
                                </p>
                            </div>

                            <div className="h-8 w-px bg-border/60" />

                            <div>
                                <p className="text-[9px] font-mono uppercase tracking-[0.16em] text-muted-foreground/60">
                                    Unread
                                </p>

                                <p className="mt-1 text-xl font-semibold tracking-tight text-primary">
                                    {unreadNotifications.length}
                                </p>
                            </div>
                        </div>
                    </div>
                </header>


                {/* =====================================================
                    TOOLBAR
                ====================================================== */}
                <div className="mb-4 flex flex-col gap-3 border-y border-border/50 bg-sidebar/20 px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between">

                    {/* Filters */}
                    <div className="flex items-center gap-1">

                        <button
                            type="button"
                            onClick={() => setFilter("all")}
                            className={`
                                relative px-3 py-1.5
                                text-[10px]
                                font-mono
                                uppercase
                                tracking-[0.12em]
                                transition-colors
                                ${filter === "all"
                                    ? "bg-foreground text-background"
                                    : "text-muted-foreground/60 hover:bg-surface hover:text-foreground"
                                }
                            `}
                        >
                            All
                        </button>

                        <button
                            type="button"
                            onClick={() => setFilter("unread")}
                            className={`
                                flex items-center gap-2
                                px-3 py-1.5
                                text-[10px]
                                font-mono
                                uppercase
                                tracking-[0.12em]
                                transition-colors
                                ${filter === "unread"
                                    ? "bg-foreground text-background"
                                    : "text-muted-foreground/60 hover:bg-surface hover:text-foreground"
                                }
                            `}
                        >
                            Unread

                            {unreadNotifications.length > 0 && (
                                <span
                                    className={`
                                        flex size-4 items-center justify-center
                                        text-[8px]
                                        ${filter === "unread"
                                            ? "bg-primary text-primary-foreground"
                                            : "bg-primary/10 text-primary"
                                        }
                                    `}
                                >
                                    {unreadNotifications.length > 9
                                        ? "9+"
                                        : unreadNotifications.length}
                                </span>
                            )}
                        </button>
                    </div>

                    {/* Right metadata */}
                    <div className="flex items-center gap-3 text-[9px] font-mono uppercase tracking-[0.12em] text-muted-foreground/60">
                        <span>
                            {filter === "unread"
                                ? `${visibleNotifications.length} unread`
                                : `${visibleNotifications.length} notifications`}
                        </span>

                        <span className="size-1 bg-border" />

                        <span>Live inbox</span>
                    </div>
                </div>


                {/* =====================================================
                    NOTIFICATION LIST
                ====================================================== */}
                <div className="relative overflow-hidden border border-border/60 bg-card">

                    {/* Top accent */}
                    <div className="absolute left-0 right-0 top-0 h-px bg-linear-to-r from-transparent via-primary/50 to-transparent" />

                    {/* Table header */}
                    <div
                        className={`
                            hidden
                            h-10
                            items-center
                            gap-4
                            border-b border-border/60
                            bg-sidebar/30
                            px-6
                            md:grid
                            ${NOTIFICATION_GRID_COLS}
                        `}
                    >
                        <span className="text-[9px] font-mono uppercase tracking-[0.16em] text-muted-foreground/60">
                            Activity
                        </span>

                        <span className="text-center text-[9px] font-mono uppercase tracking-[0.16em] text-muted-foreground/60">
                            Type
                        </span>

                        <span className="text-center text-[9px] font-mono uppercase tracking-[0.16em] text-muted-foreground/60">
                            Received
                        </span>

                        <span />
                    </div>


                    {/* Rows */}
                    {visibleNotifications.length > 0 ? (
                        <div className="divide-y divide-border/40">

                            {visibleNotifications.map(
                                (notification) => (
                                    <NotificationRow
                                        key={notification.id}
                                        data={notification}
                                    />
                                )
                            )}

                            {/* Infinite scroll trigger */}
                            <div
                                ref={loadRef}
                                className="flex min-h-16 items-center justify-center"
                            >
                                {hasNextPage ? (
                                    isFetchingNextPage ? (
                                        <div className="flex items-center gap-2 text-[9px] font-mono uppercase tracking-[0.15em] text-muted-foreground/60">
                                            <Loader2 className="size-3 animate-spin text-primary/60" />
                                            Loading activity
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-3 text-[9px] font-mono uppercase tracking-[0.15em] text-muted-foreground/60">
                                            <span className="h-px w-8 bg-border/50" />
                                            Scroll for more
                                            <span className="h-px w-8 bg-border/50" />
                                        </div>
                                    )
                                ) : (
                                    <div className="flex items-center gap-3 text-[9px] font-mono uppercase tracking-[0.15em] text-muted-foreground/60">
                                        <span className="h-px w-8 bg-border/40" />
                                        End of activity
                                        <span className="h-px w-8 bg-border/40" />
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        /* Empty state */
                        <div className="relative flex min-h-[360px] flex-col items-center justify-center px-6">

                            <div className="absolute inset-0 opacity-[0.025] bg-[radial-gradient(circle_at_center,var(--primary)_1px,transparent_1px)] [background-size:18px_18px]" />

                            <div className="relative flex size-14 items-center justify-center border border-border bg-background">
                                {filter === "unread" ? (
                                    <CheckCheck
                                        className="size-5 text-primary/60"
                                        strokeWidth={1.4}
                                    />
                                ) : (
                                    <Inbox
                                        className="size-5 text-muted-foreground/60"
                                        strokeWidth={1.4}
                                    />
                                )}

                                <span className="absolute -right-1 -top-1 size-2 bg-border" />
                            </div>

                            <p className="relative mt-5 text-[13px] font-medium">
                                {filter === "unread"
                                    ? "You're all caught up"
                                    : "No notifications yet"}
                            </p>

                            <p className="relative mt-1.5 max-w-xs text-center text-[11px] leading-relaxed text-muted-foreground/60">
                                {filter === "unread"
                                    ? "There are no unread notifications waiting for your attention."
                                    : "Workspace activity will appear here as it happens."}
                            </p>

                            <div className="relative mt-5 flex items-center gap-2 text-[9px] font-mono uppercase tracking-[0.15em] text-muted-foreground/60">
                                <span className="size-1 bg-primary/40" />
                                Inbox clear
                            </div>
                        </div>
                    )}
                </div>


                {/* =====================================================
                    FOOTER
                ====================================================== */}
                <footer className="mt-7 flex flex-col gap-2 border-t border-border/40 pt-3 text-[9px] font-mono uppercase tracking-[0.14em] text-muted-foreground/60 sm:flex-row sm:items-center sm:justify-between">

                    <div className="flex items-center gap-2">
                        <span className="size-1 bg-primary/40" />
                        Devflow workspace
                    </div>

                    <div className="flex items-center gap-4">
                        <span>Notification center</span>
                        <span>v2.0.1</span>
                    </div>
                </footer>

            </div>
        </div>
    );
};