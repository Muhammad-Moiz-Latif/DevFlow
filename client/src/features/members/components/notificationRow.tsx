import { useEffect, useRef, useState } from "react";
import type { NotificationItem } from "../../types";
import { MoreHorizontal } from "lucide-react";
import { useUpdateNotification } from "../query/useUpdateNotification";
import { useParams } from "react-router";
import { useCurrentWorkspace } from "../../workspace/query/useCurrentWorkspace";

const notificationBadgeStyles: Record<NotificationItem["notification-type"], { label: string; className: string }> = {
    ISSUE_ASSIGNED: { label: "Issue assigned", className: "bg-status-progress/15 text-status-progress" },
    ISSUE_UNASSIGNED: { label: "Issue unassigned", className: "bg-muted text-muted-foreground" },
    COMMENT_ON_ISSUE: { label: "Comment", className: "bg-sky-500/15 text-sky-500" },
    MENTIONED: { label: "Mentioned", className: "bg-violet-500/15 text-violet-500" },
    INVITE_ACCEPTED: { label: "Invite accepted", className: "bg-emerald-500/15 text-emerald-500" },
    INVITE_ISSUED: { label: "Invite issued", className: "bg-amber-500/15 text-amber-500" },
    REMOVED: { label: "Removed", className: "bg-rose-500/15 text-rose-500" },
};

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
           mutate();
        };
    }, [visibility, data.isRead])


    return (
        <div ref={rowElement} className="grid grid-cols-[minmax(0,1fr)_140px_193px_48px] items-center gap-4 px-6 py-6 transition-colors hover:bg-white/1.5">
            <div className="min-w-0">
                <h2 className="truncate text-[15px] font-semibold text-foreground">{data.message}</h2>
                <p className="truncate text-xs text-muted-foreground">{data.link}</p>
            </div>

            <div className="flex justify-center">
                <span className={`inline-flex px-2 py-1 rounded text-[10px] font-semibold uppercase tracking-wide ${badge.className}`}>
                    {badge.label}
                </span>
            </div>

            <div className="text-center text-xs text-muted-foreground">
                {formattedDate}
            </div>

            <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
                aria-label={`Open actions for notification ${data.id}`}
            >
                <MoreHorizontal className="size-5" />
            </button>
        </div>
    );
};