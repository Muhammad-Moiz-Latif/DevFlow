import { Bell, Search, User } from "lucide-react";
import { useState } from "react";
import { NotificationDropdown } from "../ui/NotificationDropdown";
import { useParams } from "react-router";
import { useCurrentWorkspace } from "../../features/workspace/query/useCurrentWorkspace";
import { useMyInfiniteNotifications } from "../../features/members/query/useMyInfiniteNotifications";
import { useAuthStore } from "../../stores/auth-store";
import { Logout } from "../../features/auth/api/logout";
import { errorToast, successToast } from "../ui/CustomToasts";
import { useNavigate } from "react-router";
import { LogOut, ChevronRight } from "lucide-react";

export const Navbar = ({ isRetracted }: { isRetracted: boolean }) => {
    const [isDropdownActive, setIsDropDownActive] = useState(false);
    const [isUserDropdownActive, setIsUserDropdownActive] = useState(false);
    const { workspaceSlug } = useParams();
    const { user, clearAuth } = useAuthStore();
    const navigate = useNavigate();
    const [imageError, setImageError] = useState(false);
    const { data: useCurrentWorkspaceData } = useCurrentWorkspace(workspaceSlug!);
    const { data: MyInfiniteNotifications } = useMyInfiniteNotifications(useCurrentWorkspaceData?.data?.id!);
    const unreadNotifications = MyInfiniteNotifications?.pages.flatMap((data) => data.data?.notifications).filter((notification) => !notification?.isRead) ?? [];

    async function handleLogout() {
        const { success } = await Logout();
        if (success) {
            clearAuth();
            successToast("You have been logged out");
            setTimeout(() => {
                navigate('/login');
            }, 1500);
        } else {
            errorToast("An error occurred");
        }
    }

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

                    {/* User Avatar with Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setIsUserDropdownActive((prev) => !prev)}
                            className="p-1 hover:bg-surface/70 transition-colors rounded-md"
                        >
                            <div className="size-7 rounded-full bg-linear-to-br from-primary/20 to-primary/10 border border-border/60 flex items-center justify-center hover:border-primary/40 transition-colors overflow-hidden">
                                {user?.image && !imageError ? (
                                    <img
                                        src={user.image}
                                        alt={user?.username || "User"}
                                        referrerPolicy="no-referrer"
                                        onError={() => setImageError(true)}
                                        className="size-full object-cover"
                                    />
                                ) : (
                                    <User className="size-4 text-foreground/70" strokeWidth={2} />
                                )}
                            </div>
                        </button>

                        {/* User Dropdown */}
                        {isUserDropdownActive && (
                            <div className="absolute right-0 top-full mt-2 z-60 min-w-[220px]">
                                <div className="bg-surface/95 backdrop-blur-md border border-border/60 rounded-lg shadow-lg overflow-hidden">
                                    {/* User Info */}
                                    <div className="px-4 py-3 border-b border-border/40">
                                        <p className="text-sm font-medium text-foreground truncate">
                                            {user?.username || "User"}
                                        </p>
                                        <p className="text-xs text-muted-foreground/70 truncate">
                                            {user?.email || "user@example.com"}
                                        </p>
                                    </div>

                                    {/* Divider */}
                                    <div className="w-full h-px bg-border/40" />

                                    {/* Logout Button */}
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-muted-foreground/70 hover:text-destructive hover:bg-destructive/10 transition-all group"
                                    >
                                        <LogOut className="size-4 flex-shrink-0 group-hover:scale-105 transition-transform" strokeWidth={1.8} />
                                        <span className="truncate">Sign out</span>
                                        <ChevronRight className="size-3.5 ml-auto opacity-50 group-hover:opacity-100 transition-opacity" strokeWidth={1.5} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};