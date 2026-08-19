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
        <nav className={`fixed top-0 right-0 z-50 h-15.25 bg-background/80 backdrop-blur-md border-b border-border/60 transition-all duration-300 ${isRetracted ? "left-24" : "left-56"}`}>
            <div className="h-full px-6 flex items-center justify-between">
                {/* Search Bar */}
                <div className="flex-1 max-w-xs">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/60 group-focus-within:text-primary/80 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search issues..."
                            className="w-full h-10 pl-9 pr-3 rounded-md bg-surface border border-border/60 text-[13px] placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all hover:border-border"
                        />
                        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-muted-foreground/40 bg-border/30 px-1.5 py-0.5 rounded border border-border/40">
                            ⌘K
                        </kbd>
                    </div>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-1 ml-6">
                    {/* Notification Button */}
                    <div className="relative">
                        <button
                            onClick={() => setIsDropDownActive((prev) => !prev)}
                            className="relative p-2 hover:bg-surface/70 hover:cursor-pointer transition-all rounded-md text-muted-foreground/70 hover:text-foreground group"
                        >
                            <Bell className="size-5" strokeWidth={1.8} />
                            {unreadNotifications.length > 0 && (
                                <div className="absolute -top-0.5 -right-0.5 size-2.5 bg-primary rounded-full flex justify-center items-center">
                                    <span className="absolute size-full animate-ping bg-primary rounded-full" />
                                </div>
                            )}
                        </button>
                        {isDropdownActive && (
                            <div className="absolute right-0 top-full mt-2 z-60">
                                <NotificationDropdown setIsDropDownActive={setIsDropDownActive} />
                            </div>
                        )}
                    </div>

                    {/* Divider */}
                    <div className="w-px h-5 bg-border/40 mx-1" />

                    {/* Settings Button */}
                    <button className="p-2 hover:bg-surface/70 transition-colors rounded-md text-muted-foreground/70 hover:text-foreground">
                        <Settings className="size-5" strokeWidth={1.8} />
                    </button>

                    {/* User Avatar */}
                    <button className="p-1 hover:bg-surface/70 transition-colors rounded-md">
                        <div className="size-7 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 border border-border/60 flex items-center justify-center hover:border-primary/40 transition-colors">
                            <User className="size-4 text-foreground/70" strokeWidth={2} />
                        </div>
                    </button>
                </div>
            </div>
        </nav>
    );
};