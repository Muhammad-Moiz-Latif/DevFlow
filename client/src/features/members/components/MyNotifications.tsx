import { useParams } from "react-router";
import { useMyNotifications } from "../query/useMyNotifications"
import { useCurrentWorkspace } from "../../workspace/query/useCurrentWorkspace";
import { NotificationRow } from "./notificationRow";
import { Bell } from "lucide-react";

export const MyNotifications = () => {
    const { workspaceSlug } = useParams();
    const { data: workspaceData } = useCurrentWorkspace(workspaceSlug!);
    const workspaceId = workspaceData?.data?.id ?? "";
    const { data: notificationsData, isPending } = useMyNotifications(workspaceId);
    const notifications = notificationsData?.data ?? [];

    if (isPending) {
        return (
            <div className="w-full h-screen flex justify-center items-center">
                Loading notifications...
            </div>
        )
    };

    const unreadNotifications = notifications.filter((notification) => !notification.isRead).length;


    return (
        <div className="px-6 py-6 lg:px-8">
            <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                        <Bell className="size-4" />
                        <span>Inbox</span>
                    </div>
                    <div>
                        <h1 className="text-4xl font-semibold tracking-tight text-foreground">Notifications</h1>
                        <p className="mt-3 text-sm text-muted-foreground">
                            {notifications.length} total notifications
                        </p>
                        {unreadNotifications > 0 && <p className="mt-3 text-sm text-muted-foreground">
                            {unreadNotifications} unread
                        </p>}
                    </div>
                </div>
            </div>

            <div className="overflow-hidden rounded-3xl border border-border/80 bg-surface/80 shadow-[0_24px_80px_-40px_rgba(0,0,0,0.75)] backdrop-blur">
                <div className="grid grid-cols-[minmax(0,1fr)_140px_225px_48px] border-b border-border/80 px-6 py-5 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    <span>Message</span>
                    <span className="text-center">Type</span>
                    <span className="text-center">Received</span>
                    <span />
                </div>

                <div className="divide-y divide-border/80">
                   
                    {notifications.length > 0 ? (

                        notifications.map((notification) => (
                            <NotificationRow key={notification.id} data={notification} />
                        ))
                    ) : (
                        <div className="px-6 py-16 text-center text-sm text-muted-foreground">
                            No notifications yet.
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}