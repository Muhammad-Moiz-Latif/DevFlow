import { useNavigate, useParams } from "react-router"
import { useCurrentWorkspace } from "../../features/workspace/query/useCurrentWorkspace";
import { useMyNotifications } from "../../features/members/query/useMyNotifications";
import { type Dispatch, type SetStateAction } from "react";
import { DropdownRow } from "./DropdownRow";

export const NotificationDropdown = ({ setIsDropDownActive }: { setIsDropDownActive: Dispatch<SetStateAction<boolean>> }) => {
    const { workspaceSlug } = useParams();
    const { data: useCurrentWorkspaceData } = useCurrentWorkspace(workspaceSlug!);
    const { data: MyNotifications, isPending } = useMyNotifications(useCurrentWorkspaceData?.data?.id!);
    const navigate = useNavigate();
    if (isPending) {
        return (
            <div className="w-96 rounded-2xl border border-border/80 bg-popover/95 p-4 text-sm text-muted-foreground shadow-[0_24px_80px_-32px_rgba(0,0,0,0.9)] backdrop-blur-xl">
                Loading notifications...
            </div>
        );
    };


    const dropdownData = MyNotifications?.data?.filter((notification) => !notification.isRead).slice(0, 4) ?? [];

    return (
        <div className="w-96 max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-border/80 bg-popover/95 shadow-[0_24px_80px_-32px_rgba(0,0,0,0.9)] backdrop-blur-xl">
            <div className="border-b border-border/70 px-4 py-3">
                <p className="text-sm font-semibold text-foreground">Notifications</p>
                <p className="mt-1 text-xs text-muted-foreground">Showing the latest 4 updates</p>
            </div>

            <div className="max-h-74 divide-y divide-border/70 overflow-y-auto scrollbar-thin">
                {dropdownData.length > 0 ? (
                    dropdownData.map((data) => (
                        <DropdownRow key={data.id} data={data} setIsDropDownActive={setIsDropDownActive} />
                    ))
                ) : (
                    <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                        No new notifications
                    </div>
                )}
            </div>

            <div className="border-t border-border/70 bg-surface/40 px-4 py-3">
                <button
                    type="button"
                    className="text-sm font-medium text-primary transition-colors hover:text-primary/80"
                    onClick={() => {
                        setIsDropDownActive(false);
                        navigate(`/w/${workspaceSlug}/notifications`);
                    }}
                >
                    See all notifications
                </button>
            </div>
        </div>
    )
}