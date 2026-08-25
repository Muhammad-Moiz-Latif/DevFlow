import { useNavigate, useParams } from "react-router";
import { useCurrentWorkspace } from "../../features/workspace/query/useCurrentWorkspace";
import { type Dispatch, type SetStateAction } from "react";
import { DropdownRow } from "./DropdownRow";
import { useMyInfiniteNotifications } from "../../features/members/query/useMyInfiniteNotifications";
import { Bell, ArrowRight } from "lucide-react";

export const NotificationDropdown = ({
    setIsDropDownActive,
}: {
    setIsDropDownActive: Dispatch<SetStateAction<boolean>>;
}) => {
    const { workspaceSlug } = useParams();
    const { data: useCurrentWorkspaceData } = useCurrentWorkspace(workspaceSlug!);
    const { data: MyInfiniteNotifications, isPending } =
        useMyInfiniteNotifications(useCurrentWorkspaceData?.data?.id!);
    const dropdownData =
        MyInfiniteNotifications?.pages
            .flatMap((data) => data.data?.notifications ?? [])
            .filter((notification) => !notification.isRead)
            .slice(0, 4) ?? [];
    const navigate = useNavigate();

    if (isPending) {
        return (
            <div className="w-80 max-w-[calc(100vw-2rem)] border border-border bg-card">
                <div className="flex items-center justify-center gap-2.5 px-4 py-8">
                    <div className="size-3.5 border border-primary/40 border-t-primary animate-spin" />
                    <span className="text-[11px] font-mono tracking-wide text-muted-foreground/60">
                        Loading…
                    </span>
                </div>
            </div>
        );
    }

    return (
        <div className="w-80 max-w-[calc(100vw-2rem)] border border-border bg-card overflow-hidden">
            {/* Header — title block language */}
            <div className="relative h-10 border-b border-border bg-sidebar/50 flex items-center px-3.5 gap-2.5">
                {/* Tiny registration marks */}
                <div className="absolute top-1.5 left-1.5 size-1.5 border-t border-l border-primary/35" />
                <div className="absolute top-1.5 right-1.5 size-1.5 border-t border-r border-primary/35" />

                <Bell className="size-3.5 text-primary/80" strokeWidth={1.8} />
                <span className="text-[12px] font-semibold tracking-tight">
                    Notifications
                </span>
                <span className="ml-auto text-[10px] font-mono tracking-wide text-muted-foreground/50">
                    {dropdownData.length > 0 ? `${dropdownData.length} new` : "Quiet"}
                </span>
            </div>

            {/* List */}
            <div className="max-h-72 divide-y divide-border overflow-y-auto">
                {dropdownData.length > 0 ? (
                    dropdownData.map((data) => (
                        <DropdownRow
                            key={data.id}
                            data={data}
                            setIsDropDownActive={setIsDropDownActive}
                        />
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center px-4 py-12 gap-2">
                        <Bell className="size-6 text-muted-foreground/25" strokeWidth={1.5} />
                        <p className="text-[13px] text-muted-foreground/60 tracking-tight">
                            No new notifications
                        </p>
                        <p className="text-[10px] font-mono text-muted-foreground/40 tracking-wide">
                            Everything is quiet
                        </p>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="relative border-t border-border bg-sidebar/30 px-3.5 py-2.5">
                <div className="absolute bottom-1.5 left-1.5 size-1.5 border-b border-l border-primary/35" />
                <div className="absolute bottom-1.5 right-1.5 size-1.5 border-b border-r border-primary/35" />

                <button
                    type="button"
                    className="group w-full flex items-center justify-center gap-1.5 text-[12px] font-medium text-primary/80 hover:text-primary transition-colors"
                    onClick={() => {
                        setIsDropDownActive(false);
                        navigate(`/w/${workspaceSlug}/notifications`);
                    }}
                >
                    See all
                    <ArrowRight
                        className="size-3 opacity-70 group-hover:translate-x-0.5 transition-transform"
                        strokeWidth={1.8}
                    />
                </button>
            </div>
        </div>
    );
};