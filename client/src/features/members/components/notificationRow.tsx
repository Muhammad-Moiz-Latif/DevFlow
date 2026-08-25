// NotificationRow.tsx

import { useEffect, useRef, useState } from "react";
import type { NotificationItem } from "../../types";
import {
    MoreHorizontal,
} from "lucide-react";
import { useUpdateNotification } from "../query/useUpdateNotification";
import { useParams } from "react-router";
import { useCurrentWorkspace } from "../../workspace/query/useCurrentWorkspace";

export const NOTIFICATION_GRID_COLS =
    "grid-cols-[minmax(0,1fr)_140px_160px_48px]";

const notificationBadgeStyles: Record<
    NotificationItem["notification-type"],
    {
        label: string;
        dot: string;
    }
> = {
    ISSUE_ASSIGNED: {
        label: "Issue assigned",
        dot: "bg-status-progress",
    },
    ISSUE_UNASSIGNED: {
        label: "Issue unassigned",
        dot: "bg-border",
    },
    COMMENT_ON_ISSUE: {
        label: "Comment",
        dot: "bg-status-review",
    },
    MENTIONED: {
        label: "Mentioned",
        dot: "bg-primary",
    },
    INVITE_ACCEPTED: {
        label: "Invite accepted",
        dot: "bg-status-done",
    },
    INVITE_ISSUED: {
        label: "Invite issued",
        dot: "bg-priority-medium",
    },
    REMOVED: {
        label: "Removed",
        dot: "bg-priority-urgent",
    },
};

const getInitials = (name: string) =>
    name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join("");

export const NotificationRow = ({
    data,
}: {
    data: NotificationItem;
}) => {
    const { workspaceSlug } = useParams();

    const { data: workspaceData } =
        useCurrentWorkspace(workspaceSlug!);

    const workspaceId =
        workspaceData?.data?.id ?? "";

    const badge =
        notificationBadgeStyles[
        data["notification-type"]
        ];

    const rowElement =
        useRef<HTMLDivElement | null>(null);

    const [visibility, setVisibility] =
        useState(false);

    const { mutate } =
        useUpdateNotification(
            workspaceId,
            data.id
        );

    const formattedDate =
        new Intl.DateTimeFormat("en-US", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        }).format(new Date(data.createdAt));

    const formattedTime =
        new Intl.DateTimeFormat("en-US", {
            hour: "2-digit",
            minute: "2-digit",
        }).format(new Date(data.createdAt));

    /*
     * Mark notification as read when it enters the viewport.
     */
    useEffect(() => {
        const element = rowElement.current;

        if (!element) return;

        const intersectionObserver =
            new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) {
                        setVisibility(true);
                        intersectionObserver.disconnect();
                    }
                },
                {
                    threshold: 0.5,
                }
            );

        intersectionObserver.observe(element);

        return () =>
            intersectionObserver.disconnect();
    }, []);

    useEffect(() => {
        if (visibility && !data.isRead) {
            const timer = setTimeout(() => {
                mutate();
            }, 800);

            return () => clearTimeout(timer);
        }
    }, [
        visibility,
        data.isRead,
        mutate,
    ]);

    return (
        <div
            ref={rowElement}
            className={`
                group relative
                grid
                ${NOTIFICATION_GRID_COLS}
                items-center
                gap-4
                px-6
                py-4
                transition-all
                duration-300

                ${!data.isRead
                    ? "bg-primary/[0.035]"
                    : "bg-transparent"
                }

                hover:bg-surface/60

                border-l-2

                ${!data.isRead
                    ? "border-l-primary"
                    : "border-l-transparent"
                }
            `}
        >
            {/* Unread indicator */}
            {!data.isRead && (
                <span
                    className="
                        absolute
                        left-0
                        top-1/2
                        size-1.5
                        -translate-x-[3px]
                        -translate-y-1/2
                        bg-primary
                        shadow-[0_0_0_3px_var(--background)]
                    "
                />
            )}

            {/* Activity */}
            <div className="flex min-w-0 items-center gap-3">

                {/* Avatar */}
                {data.user.img ? (
                    <div className="relative shrink-0">
                        <img
                            src={data.user.img}
                            alt={data.user.username}
                            className={`
                                size-9
                                rounded-full
                                object-cover
                                ring-1
                                transition-all
                                ${!data.isRead
                                    ? "ring-primary/30"
                                    : "ring-border"
                                }
                            `}
                        />

                        {!data.isRead && (
                            <span className="absolute -right-0.5 -top-0.5 size-2 bg-primary" />
                        )}
                    </div>
                ) : (
                    <div
                        className={`
                            flex
                            size-9
                            shrink-0
                            items-center
                            justify-center
                            border
                            text-[10px]
                            font-mono

                            ${!data.isRead
                                ? "border-primary/30 bg-primary/5 text-primary"
                                : "border-border text-muted-foreground"
                            }
                        `}
                    >
                        {getInitials(
                            data.user.username
                        )}
                    </div>
                )}

                {/* Content */}
                <div className="min-w-0">

                    <div className="flex items-center gap-2">
                        <h2
                            className={`
                                truncate
                                text-[13px]
                                tracking-[-0.01em]

                                ${!data.isRead
                                    ? "font-semibold text-foreground"
                                    : "font-medium text-foreground/70"
                                }
                            `}
                        >
                            {data.message}
                        </h2>

                        {!data.isRead && (
                            <span className="hidden shrink-0 text-[8px] font-mono uppercase tracking-[0.12em] text-primary/60 sm:inline">
                                New
                            </span>
                        )}
                    </div>

                    <p
                        className={`
                            mt-0.5
                            truncate
                            text-[11px]
                            ${!data.isRead
                                ? "text-muted-foreground/60"
                                : "text-muted-foreground/60"
                            }
                        `}
                    >
                        {data.user.username}
                    </p>
                </div>
            </div>


            {/* Type */}
            <div className="hidden justify-center md:flex">
                <span
                    className={`
                        inline-flex
                        items-center
                        gap-1.5
                        border
                        px-2
                        py-1
                        text-[9px]
                        font-mono
                        uppercase
                        tracking-[0.08em]

                        ${!data.isRead
                            ? "border-primary/20 bg-primary/[0.04] text-foreground/70"
                            : "border-border/50 text-muted-foreground/60"
                        }
                    `}
                >
                    <span
                        className={`size-1.5 ${badge.dot}`}
                    />

                    {badge.label}
                </span>
            </div>


            {/* Date */}
            <div className="hidden text-center md:block">
                <p
                    className={`
                        text-[10px]
                        font-mono
                        ${!data.isRead
                            ? "text-muted-foreground/60"
                            : "text-muted-foreground/60"
                        }
                    `}
                >
                    {formattedDate}
                </p>

                <p className="mt-0.5 text-[9px] font-mono text-muted-foreground/60">
                    {formattedTime}
                </p>
            </div>


            {/* Action */}
            <button
                type="button"
                className="
                    mx-auto
                    flex
                    size-8
                    items-center
                    justify-center
                    border
                    border-transparent
                    text-muted-foreground/60
                    transition-all
                    hover:border-border
                    hover:bg-background
                    hover:text-foreground
                "
                aria-label={`Open actions for notification ${data.id}`}
            >
                <MoreHorizontal
                    className="size-4"
                    strokeWidth={1.7}
                />
            </button>

            {/* Hover edge */}
            <div className="
                pointer-events-none
                absolute
                bottom-0
                left-0
                h-px
                w-0
                bg-primary/40
                transition-all
                duration-500
                group-hover:w-full
            " />
        </div>
    );
};