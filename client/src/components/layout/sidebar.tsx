import { useMemo, type Dispatch, type SetStateAction } from "react";
import { Logout } from "../../features/auth/api/logout";
import { errorToast, successToast } from "../ui/CustomToasts";
import { Link, useNavigate, useParams } from "react-router";
import { useAuthStore } from "../../stores/auth-store";
import logo from '../../assets/logo.png';
import { useUserWorkspaces } from "../../features/workspace/query/useAllUserWorkspaces";
import { ChevronLeft, LayoutDashboard, ListTodo, FolderKanban, Users, Bell, LogOut, ChevronRight, Plus } from "lucide-react";
import { useCurrentWorkspace } from "../../features/workspace/query/useCurrentWorkspace";
import { useMyInfiniteNotifications } from "../../features/members/query/useMyInfiniteNotifications";
import { WorkspaceDropDown } from "../ui/WorkspaceDropdown";

export const Sidebar = ({ isRetracted, setIsRetracted }: { isRetracted: boolean, setIsRetracted: Dispatch<SetStateAction<boolean>> }) => {
    const { clearAuth } = useAuthStore();
    const { workspaceSlug } = useParams();
    const { data } = useUserWorkspaces();
    const { data: currentWorkspaceData } = useCurrentWorkspace(workspaceSlug!);
    const { data: MyInfiniteNotifications } = useMyInfiniteNotifications(currentWorkspaceData?.data?.id!);
    const unreadNotifications = MyInfiniteNotifications?.pages.flatMap((data) => data.data?.notifications).filter((notification) => !notification?.isRead) ?? [];
    const navigate = useNavigate();

    const firstWorkspace = useMemo(() => data?.data![0], [data]);

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
    };

    const navItems = [
        { icon: LayoutDashboard, label: "Dashboard", id: `/w/${firstWorkspace?.workspace.slug}` },
        { icon: ListTodo, label: "My Issues", id: "my-issues" },
        { icon: FolderKanban, label: "Projects", id: "projects" },
        { icon: Users, label: "Members", id: "members" },
        { icon: Bell, label: "Notifications", id: "notifications" },
    ];

    return (
        <aside className={`h-screen bg-sidebar/80 backdrop-blur-sm border-r border-border/60 fixed flex flex-col transition-all ease-in-out duration-300 ${isRetracted ? "w-24" : "w-56"} overflow-y-auto`}>
            {/* Header */}
            <div className="p-4 border-b border-border/60">
                <div className="flex items-center justify-between gap-2">
                    {!isRetracted && (
                        <div className="flex items-center gap-2.5 flex-1 min-w-0">
                            <Link
                                to={`/w/${workspaceSlug}`}
                                className="flex items-center gap-2.5 group"
                            >
                                <img
                                    src={logo}
                                    alt="DevFlow logo"
                                    className="size-7 object-contain transition-transform duration-200 group-hover:scale-105"
                                />

                                <span className="text-[15px] font-semibold tracking-[-0.02em] text-foreground flex items-baseline gap-[1px]">
                                    Dev<span className="font-mono text-[13px] font-medium text-primary">FLOW</span>
                                </span>
                            </Link>
                            <span className="text-[9px] font-mono tracking-[0.12em] text-muted-foreground/40 uppercase ml-0.5">
                                / app
                            </span>
                        </div>
                    )}
                    <button
                        onClick={() => setIsRetracted((prev) => !prev)}
                        className={`p-1.5 hover:bg-surface/70 transition-colors rounded-md text-muted-foreground/60 hover:text-foreground flex-shrink-0 ${isRetracted ? "mx-auto" : ""}`}
                        title={isRetracted ? "Expand sidebar" : "Collapse sidebar"}
                    >
                        {isRetracted ? (
                            <ChevronRight className="size-4" strokeWidth={1.8} />
                        ) : (
                            <ChevronLeft className="size-4" strokeWidth={1.8} />
                        )}
                    </button>
                </div>
            </div>

            {/* Workspace Selector */}
            <div className="p-3 border-b border-border/40">
                <WorkspaceDropDown />
            </div>

            {/* Navigation Items */}
            <nav className="flex-1 px-3 py-4 space-y-0.5">
                {/* Create Workspace Button */}
                <button
                    className={`w-full flex items-center gap-3 px-3 h-9 rounded-md text-sm transition-all border border-dashed border-muted-foreground/30 text-muted-foreground/60 hover:text-foreground hover:border-foreground/30 hover:bg-surface/40 group ${isRetracted ? "justify-center" : ""}`}
                    onClick={() => navigate('/create-workspace')}
                    title={isRetracted ? "Create Workspace" : ""}
                >
                    <Plus className="size-4 flex-shrink-0 group-hover:rotate-90 transition-transform duration-300" />
                    {!isRetracted && <span className="truncate">New Workspace</span>}
                </button>

                {/* Navigation Items */}
                {navItems.map(({ icon: Icon, label, id }) => {
                    const isNotifications = id === 'notifications';
                    const hasUnread = isNotifications && unreadNotifications.length > 0;

                    return (
                        <button
                            key={id}
                            onClick={() => navigate(id)}
                            className={`w-full flex items-center gap-3 px-3 h-9 rounded-md text-sm transition-all ${isRetracted ? "justify-center" : ""} text-muted-foreground/70 hover:text-foreground hover:bg-surface/40 group relative`}
                            title={isRetracted ? label : ""}
                        >
                            <Icon className="size-4 flex-shrink-0 group-hover:scale-105 transition-transform" strokeWidth={1.8} />
                            {!isRetracted && <span className="truncate">{label}</span>}

                            {hasUnread && (
                                <div className={`flex items-center justify-center ${isRetracted ? "absolute -top-0.5 -right-0.5" : "ml-auto"}`}>
                                    <div className={`${isRetracted ? "size-2.5" : "size-5"} bg-primary rounded-full flex items-center justify-center relative`}>
                                        {!isRetracted && (
                                            <span className="text-[9px] font-mono text-primary-foreground font-medium">
                                                {unreadNotifications.length > 9 ? '9+' : unreadNotifications.length}
                                            </span>
                                        )}
                                        <span className={`absolute inset-0 bg-primary rounded-full animate-ping opacity-60 ${isRetracted ? "size-2.5" : "size-5"}`} />
                                    </div>
                                </div>
                            )}
                        </button>
                    );
                })}
            </nav>

            {/* Footer with Registration Marks */}
            <div className="relative p-3 border-t border-border/60">
                {/* Mini registration marks */}
                <div className="absolute top-2 left-3 size-1.5 border-t border-l border-primary/20" />
                <div className="absolute top-2 right-3 size-1.5 border-t border-r border-primary/20" />

                <button
                    onClick={handleLogout}
                    className={`w-full flex items-center gap-3 px-3 h-9 rounded-md text-sm transition-all ${isRetracted ? "justify-center" : ""} text-muted-foreground/60 hover:text-destructive hover:bg-destructive/10 group`}
                    title={isRetracted ? "Logout" : ""}
                >
                    <LogOut className="size-4 flex-shrink-0 group-hover:scale-105 transition-transform" strokeWidth={1.8} />
                    {!isRetracted && <span className="truncate">Sign out</span>}
                </button>

                {/* Version info */}
                {!isRetracted && (
                    <div className="mt-3 flex items-center justify-center gap-2 text-[8px] font-mono tracking-[0.12em] text-muted-foreground/30 uppercase">
                        <span>v.2.0.1</span>
                        <span className="w-px h-2 bg-border/30" />
                        <span>devflow.app</span>
                    </div>
                )}
            </div>
        </aside>
    );
};