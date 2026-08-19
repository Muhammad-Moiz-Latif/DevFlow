// MyNotifications.tsx
import { useParams } from "react-router";
import { useCurrentWorkspace } from "../../workspace/query/useCurrentWorkspace";
import { NotificationRow, NOTIFICATION_GRID_COLS } from "./notificationRow";
import { Bell, Loader2 } from "lucide-react";
import { useMyInfiniteNotifications } from "../query/useMyInfiniteNotifications";
import { useEffect, useRef } from "react";

export const MyNotifications = () => {
    const { workspaceSlug } = useParams();
    const { data: workspaceData } = useCurrentWorkspace(workspaceSlug!);
    const workspaceId = workspaceData?.data?.id ?? "";
    const { data: infiniteNotificationsData, fetchNextPage, hasNextPage, isPending, isFetchingNextPage } = useMyInfiniteNotifications(workspaceId);
    const loadRef = useRef<HTMLHeadingElement | null>(null);
    const notifications = infiniteNotificationsData?.pages.flatMap((data) => data.data?.notifications ?? []) ?? [];
    useEffect(() => {
        if (!loadRef.current) return;

        const intersectionObserver = new IntersectionObserver(([loadRef]) => {
            if (loadRef.isIntersecting && hasNextPage && !isFetchingNextPage) {
                fetchNextPage();
            };
        }, { threshold: 1 });

        intersectionObserver.observe(loadRef.current);

        return () => intersectionObserver.disconnect();
    }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

    if (isPending) {
        return (
            <div className="p-6 max-w-6xl mx-auto flex items-center justify-center min-h-[60vh]">
                <div className="flex items-center gap-2.5 border border-border bg-card px-5 py-3">
                    <Loader2 className="size-3.5 animate-spin text-primary" />
                    <span className="text-[12px] font-mono tracking-wide text-muted-foreground">
                        Loading notifications…
                    </span>
                </div>
            </div>
        );
    };

    const unreadNotifications = notifications.filter((notification) => !notification.isRead).length;

    return (
        <div className="p-5 md:p-6 max-w-6xl mx-auto">
            {/* ── Title block ── */}
            <div className="relative mb-7 pb-5 pt-4 border-b border-border">
                {/* Registration marks */}
                <div className="absolute top-4 left-0 size-2.5 border-t border-l border-primary/40" />
                <div className="absolute top-4 right-0 size-2.5 border-t border-r border-primary/40" />

                <div className="flex items-start justify-between gap-4 p-2">
                    <div className="min-w-0">
                        <div className="inline-flex items-center gap-3 mb-3 text-[10px] font-mono tracking-[0.14em] text-muted-foreground/55 uppercase">
                            <span className="w-4 h-px bg-border" />
                            Notifications
                            <span className="w-4 h-px bg-border" />
                            <span className="text-muted-foreground/40 normal-case">Inbox</span>
                        </div>

                        <h1 className="text-[1.5rem] md:text-[1.65rem] font-semibold tracking-[-0.03em] leading-tight">
                            Notifications
                        </h1>

                        <p className="text-[13.5px] text-muted-foreground mt-1.5 leading-relaxed">
                            <span className="text-foreground font-medium">{notifications.length}</span> total
                            {unreadNotifications > 0 && (
                                <>
                                    {" "}
                                    ·{" "}
                                    <span className="text-foreground/80 font-medium">
                                        {unreadNotifications} unread
                                    </span>
                                </>
                            )}
                        </p>
                    </div>

                    {/* Unread badge — the one place this count is repeated */}
                    <div className="flex items-center gap-2 shrink-0">
                        {unreadNotifications > 0 && (
                            <div className="flex items-center gap-1.5 px-2.5 py-1.5 border border-primary/40 bg-primary/5">
                                <span className="size-1.5 bg-primary" />
                                <span className="text-[10px] font-mono text-primary/80 tracking-wide">
                                    {unreadNotifications} unread
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Notifications table ── */}
            <div className="border border-border/60 bg-card overflow-hidden">
                {/* Header row — same column template as NotificationRow, imported so it can't drift */}
                <div className={`h-9 border-b border-border/60 bg-sidebar/30 grid ${NOTIFICATION_GRID_COLS} items-center px-4 gap-4`}>
                    <span className="text-[10px] font-mono tracking-wide text-muted-foreground/60 uppercase">
                        Message
                    </span>
                    <span className="text-[10px] font-mono tracking-wide text-muted-foreground/60 uppercase text-center">
                        Type
                    </span>
                    <span className="text-[10px] font-mono tracking-wide text-muted-foreground/60 uppercase text-center">
                        Received
                    </span>
                    <span />
                </div>

                {notifications.length > 0 ? (
                    <div className="divide-y divide-border/40">
                        {notifications.map((notification) => (
                            <NotificationRow key={notification.id} data={notification} />
                        ))}

                        {/* Load more trigger */}
                        <div
                            ref={loadRef}
                            className="flex items-center justify-center py-4 text-[10px] font-mono text-muted-foreground/40 tracking-wide"
                        >
                            {hasNextPage ? (
                                isFetchingNextPage ? (
                                    <span className="flex items-center gap-2">
                                        <Loader2 className="size-3 animate-spin text-primary" />
                                        Loading more…
                                    </span>
                                ) : (
                                    <span>Load more notifications</span>
                                )
                            ) : (
                                <span className="flex items-center gap-2">
                                    <span className="w-4 h-px bg-border/40" />
                                    End of the line
                                    <span className="w-4 h-px bg-border/40" />
                                </span>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-16 gap-2">
                        <Bell className="size-8 text-muted-foreground/20" strokeWidth={1.5} />
                        <p className="text-[13px] text-muted-foreground/60 font-medium tracking-tight">
                            No notifications yet
                        </p>
                        <p className="text-[10px] font-mono text-muted-foreground/40 tracking-wide">
                            Everything is quiet
                        </p>
                    </div>
                )}
            </div>

            {/* ── Footer ── */}
            <div className="mt-6 flex items-center justify-between text-[9px] font-mono tracking-[0.12em] text-muted-foreground/30 uppercase border-t border-border/50 pt-3">
                <span>devflow.app</span>
                <span>v2.0.1</span>
            </div>
        </div>
    );
};