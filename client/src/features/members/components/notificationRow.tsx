// NotificationRow.tsx
import { useEffect, useRef, useState } from "react";
import type { NotificationItem } from "../../types";
import { MoreHorizontal } from "lucide-react";
import { useUpdateNotification } from "../query/useUpdateNotification";
import { useParams } from "react-router";
import { useCurrentWorkspace } from "../../workspace/query/useCurrentWorkspace";

// Single source of truth for column widths — MyNotifications' header row
// must use this exact string too, or the header will drift out of alignment.
export const NOTIFICATION_GRID_COLS = "grid-cols-[minmax(0,1fr)_140px_160px_48px]";

const notificationBadgeStyles: Record<NotificationItem["notification-type"], { label: string; dot: string }> = {
    ISSUE_ASSIGNED: { label: "Issue assigned", dot: "bg-status-progress" },
    ISSUE_UNASSIGNED: { label: "Issue unassigned", dot: "bg-border" },
    COMMENT_ON_ISSUE: { label: "Comment", dot: "bg-status-review" },
    MENTIONED: { label: "Mentioned", dot: "bg-primary" },
    INVITE_ACCEPTED: { label: "Invite accepted", dot: "bg-status-done" },
    INVITE_ISSUED: { label: "Invite issued", dot: "bg-priority-medium" },
    REMOVED: { label: "Removed", dot: "bg-priority-urgent" },
};

const getInitials = (name: string) =>
    name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join("");

export const NotificationRow = ({ data }: { data: NotificationItem }) => {
    const { workspaceSlug } = useParams();
    const { data: workspaceData } = useCurrentWorkspace(workspaceSlug!);
    const workspaceId = workspaceData?.data?.id ?? "";
    const badge = notificationBadgeStyles[data["notification-type"]];
    const rowElement = useRef<HTMLDivElement | null>(null);
    const [visibility, setVisibility] = useState(false);
    const { mutate } = useUpdateNotification(workspaceId, data.id);
    const formattedDate = new Intl.DateTimeFormat("en-US", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    }).format(new Date(data.createdAt));

    useEffect(() => {
        const element = rowElement.current;
        if (!element) return;

        const intersectionObserver = new IntersectionObserver(([rowElement]) => {
            if (rowElement.isIntersecting) {
                setVisibility(true);
                intersectionObserver.disconnect();
            };
        }, { threshold: 0.5 });

        intersectionObserver.observe(element);

        return () => intersectionObserver.disconnect()
    }, []);

    useEffect(() => {
        if (visibility && !data.isRead) {
            setTimeout(() => {
                mutate()
            }, 800);
        };
    }, [visibility, data.isRead, mutate])

    return (
        <div
            ref={rowElement}
            className={`grid ${NOTIFICATION_GRID_COLS} items-center gap-4 px-6 py-4 transition-colors duration-500 hover:bg-surface/60 ${!data.isRead ? "bg-primary/5 border-l-2 border-l-primary" : "bg-transparent border-l-2 border-l-transparent"
                }`}
        >
            <div className="flex items-center gap-3 min-w-0">
                {data.user.img ? (
                    <img
                        src={data.user.img}
                        alt={data.user.username}
                        className="size-8 rounded-full object-cover ring-1 ring-border shrink-0"
                    />
                ) : (
                    <div className="size-8 flex items-center justify-center border border-border text-[10px] font-mono text-muted-foreground shrink-0">
                        {getInitials(data.user.username)}
                    </div>
                )}
                <div className="min-w-0">
                    <h2 className="truncate text-[14px] font-semibold text-foreground">{data.message}</h2>
                    <p className="truncate text-xs text-muted-foreground">{data.user.username}</p>
                </div>
            </div>

            <div className="flex justify-center">
                <span className="inline-flex items-center gap-1.5 border border-border/60 px-2 py-1 text-[10px] font-mono uppercase tracking-wide text-foreground/70">
                    <span className={`size-1.5 ${badge.dot}`} />
                    {badge.label}
                </span>
            </div>

            <div className="text-center text-xs font-mono text-muted-foreground">
                {formattedDate}
            </div>

            <button
                type="button"
                className="flex h-8 w-8 items-center justify-center border border-transparent text-muted-foreground transition-colors hover:border-border hover:text-foreground mx-auto"
                aria-label={`Open actions for notification ${data.id}`}
            >
                <MoreHorizontal className="size-4" />
            </button>
        </div>
    );
};