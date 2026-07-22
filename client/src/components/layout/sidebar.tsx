import { useMemo, useState, type Dispatch, type SetStateAction } from "react";
import { Logout } from "../../features/auth/api/logout";
import { errorToast, successToast } from "../ui/CustomToasts";
import { useNavigate, useParams } from "react-router";
import { useAuthStore } from "../../stores/auth-store";
import { useUserWorkspaces } from "../../features/workspace/query/useAllUserWorkspaces";
import { ChevronLeft, LayoutDashboard, ListTodo, FolderKanban, Users, Bell, LogOut, ChevronRight, CircleDot } from "lucide-react";
import { useMyNotifications } from "../../features/members/query/useMyNotifications";
import { useCurrentWorkspace } from "../../features/workspace/query/useCurrentWorkspace";

export const Sidebar = ({ isRetracted, setIsRetracted }: { isRetracted: boolean, setIsRetracted: Dispatch<SetStateAction<boolean>> }) => {
    const { clearAuth } = useAuthStore();
    const { workspaceSlug } = useParams();
    const { data, isPending } = useUserWorkspaces();
    const { data: currentWorkspaceData } = useCurrentWorkspace(workspaceSlug!);
    const { data: MyNotifications } = useMyNotifications(currentWorkspaceData?.data?.id!);
    const unreadNotifications = MyNotifications?.data?.filter((notifications) => !notifications.isRead).length;
    const navigate = useNavigate();

    const firstWorkspace = useMemo(() => data?.data![0], [data]);
    const allWorkspaces = data?.data!.map((workspace) => {
        return <option
            key={workspace.workspace.name}
            value={workspace.workspace.slug}
        >
            {workspace.workspace.name}
        </option>
    });

    function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
        const selectedSlug = e.target.value;
        navigate(`/w/${selectedSlug}`)
    };

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
        <aside className={`h-screen bg-sidebar border-r border-sidebar-border fixed flex flex-col transition-all ease-in-out duration-300 ${isRetracted ? "w-24" : "w-56"} overflow-y-auto`}>
            {/* Header */}
            <div className="p-4 border-b border-sidebar-border">
                <div className="flex items-center justify-between gap-2">
                    {!isRetracted && (
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                            <div className="size-6 rounded-md bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center flex-shrink-0">
                                <CircleDot className="size-3.5 text-primary-foreground" strokeWidth={2.5} />
                            </div>
                            <span className="text-sm font-semibold tracking-tight truncate">DevFlow</span>
                        </div>
                    )}
                    <button
                        onClick={() => setIsRetracted((prev) => !prev)}
                        className="p-1.5 hover:bg-surface transition-colors rounded-md text-muted-foreground hover:text-foreground flex-shrink-0"
                        title={isRetracted ? "Expand sidebar" : "Collapse sidebar"}
                    >
                        {isRetracted ? (
                            <ChevronRight className="size-4" />
                        ) : (
                            <ChevronLeft className="size-4" />
                        )}
                    </button>
                </div>
            </div>

            {/* Workspace Selector */}
            <div className="p-4 border-b border-sidebar-border">
                {isPending ? (
                    <div className="text-xs text-muted-foreground text-center py-2">Loading...</div>
                ) : (
                    <select
                        onChange={handleChange}
                        value={workspaceSlug}
                        className={`w-full h-9 px-2 rounded-md bg-surface border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition-all cursor-pointer ${isRetracted ? "text-center" : ""}`}
                        title={isRetracted ? "Switch workspace" : ""}
                    >
                        {allWorkspaces}
                    </select>
                )}
            </div>

            {/* Navigation Items */}
            <nav className="flex-1 px-3 py-4 space-y-1">
                <button
                    className={`w-full flex items-center justify-center gap-3 px-3 h-9 rounded-md text-xl transition-colors ${isRetracted ? "justify-center" : ""
                        } border border-muted-foreground cursor-pointer text-muted-foreground hover:text-foreground hover:bg-surface group`}
                    onClick={() => navigate('/create-workspace')}
                >+</button>
                {navItems.map(({ icon: Icon, label, id }) => (
                    <button
                        key={id}
                        onClick={() => navigate(id)}
                        className={`w-full flex items-center cursor-pointer gap-3 px-3 h-9 rounded-md text-sm transition-colors ${isRetracted ? "justify-center" : ""
                            } text-muted-foreground hover:text-foreground hover:bg-surface group`}
                        title={isRetracted ? label : ""}
                    >
                        <Icon className="size-4 flex-shrink-0" />
                        {!isRetracted && <span className="truncate">{label}</span>}
                        {(id === 'notifications' && unreadNotifications! > 0) && <div className="relative size-4.5">
                            <div className="size-full bg-primary absolute animate-ping z-0  rounded-full"></div>
                            <h1 className="size-full bg-primary rounded-full z-10 text-white flex justify-center items-center text-xs">{unreadNotifications}</h1></div>}
                    </button>
                ))}
            </nav>

            {/* Logout Button */}
            <div className="p-3 border-t border-sidebar-border">
                <button
                    onClick={handleLogout}
                    className={`w-full flex items-center gap-3 px-3 h-9 rounded-md text-sm transition-colors ${isRetracted ? "justify-center" : ""
                        } text-muted-foreground hover:text-destructive hover:bg-destructive/10 group`}
                    title={isRetracted ? "Logout" : ""}
                >
                    <LogOut className="size-4 flex-shrink-0" />
                    {!isRetracted && <span className="truncate">Logout</span>}
                </button>
            </div>
        </aside>
    );
};