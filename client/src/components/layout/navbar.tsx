import { Bell, Search, Settings, User } from "lucide-react";
import { useState } from "react";
import { NotificationDropdown } from "../ui/NotificationDropdown";
import { useParams } from "react-router";
import { useCurrentWorkspace } from "../../features/workspace/query/useCurrentWorkspace";
import { useMyInfiniteNotifications } from "../../features/members/query/useMyInfiniteNotifications";

export const Navbar = ({ isRetracted }: { isRetracted: boolean }) => {
    const [isDropdownActive, setIsDropDownActive] = useState(false);
    const { workspaceSlug } = useParams();
    const { data: useCurrentWorkspaceData } = useCurrentWorkspace(workspaceSlug!);
    const { data: MyInfiniteNotifications } = useMyInfiniteNotifications(useCurrentWorkspaceData?.data?.id!);
    const unreadNotifications = MyInfiniteNotifications?.pages.flatMap((data) => data.data?.notifications).filter((notification) => !notification?.isRead) ?? [];

    return (
        <nav className={`fixed top-0 right-0 z-50 h-14 bg-background/80 backdrop-blur-md border-b border-border/60 transition-all duration-300 ${isRetracted ? "left-24" : "left-56"}`}>
            <div className="h-full px-6 flex items-center justify-between">
                {/* Search Bar */}
                <div className="flex-1 max-w-xs">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search issues..."
                            className="w-full h-9 pl-9 pr-3 rounded-md bg-surface border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition-all"
                        />
                    </div>
                </div>


                {/* Right Actions */}
                <div className="flex items-center gap-2 ml-6">
                    <div className="relative">
                        <button onClick={() => setIsDropDownActive((prev) => !prev)} className="relative p-2 hover:bg-surface hover:cursor-pointer transition-colors rounded-md text-muted-foreground hover:text-foreground group">
                            <Bell className="size-5" />
                            {
                                unreadNotifications.length > 0 && <div className="absolute top-1 right-1 size-2  bg-primary rounded-full flex justify-center items-center">
                                    <span className="absolute size-full animate-ping bg-primary rounded-full" />
                                </div>
                            }

                        </button>
                        {isDropdownActive && (
                            <div className="absolute right-0 top-full mt-3 z-60">
                                <NotificationDropdown setIsDropDownActive={setIsDropDownActive} />
                            </div>
                        )}
                    </div>


                    <button className="p-2 hover:bg-surface transition-colors rounded-md text-muted-foreground hover:text-foreground">
                        <Settings className="size-5" />
                    </button>

                    <div className="w-px h-6 bg-border/40 mx-1" />

                    <button className="p-2 hover:bg-surface transition-colors rounded-md text-muted-foreground hover:text-foreground">
                        <User className="size-5" />
                    </button>
                </div>
            </div>
        </nav>
    );
};