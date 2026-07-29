import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate, useParams } from "react-router";
import { ChevronDown, Check } from "lucide-react";
import { useUserWorkspaces } from "../../features/workspace/query/useAllUserWorkspaces";

export const WorkspaceDropDown = () => {
    const { data, isPending } = useUserWorkspaces();
    const { workspaceSlug } = useParams();
    const navigate = useNavigate();

    const [isOpen, setIsOpen] = useState(false);
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const triggerRef = useRef<HTMLButtonElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);

    const dropDownData = useMemo(() => {
        const grouped: { role: string, workspace: { name: string, slug: string }[] }[] = [];
        data?.data?.forEach((item) => {
            const existingRole = grouped.find((group) => group.role === item.role);

            if (existingRole) {
                existingRole.workspace.push(item.workspace);
            } else {
                grouped.push({
                    role: item.role,
                    workspace: [item.workspace]
                })
            }
        });

        return grouped;
    }, [data]);

    const currentWorkspace = useMemo(() => {
        for (const group of dropDownData) {
            const match = group.workspace.find((w) => w.slug === workspaceSlug);
            if (match) return match;
        }
        return undefined;
    }, [dropDownData, workspaceSlug]);

    function updatePosition() {
        if (!triggerRef.current) return;
        const rect = triggerRef.current.getBoundingClientRect();
        setPosition({ top: rect.bottom + 6, left: rect.left });
    }

    function toggleOpen() {
        if (!isOpen) updatePosition();
        setIsOpen((prev) => !prev);
    }

    useEffect(() => {
        if (!isOpen) return;

        function handleClickOutside(e: MouseEvent) {
            const target = e.target as Node;
            if (
                triggerRef.current && !triggerRef.current.contains(target) &&
                panelRef.current && !panelRef.current.contains(target)
            ) {
                setIsOpen(false);
            }
        }

        function handleReposition() {
            updatePosition();
        }

        document.addEventListener("mousedown", handleClickOutside);
        window.addEventListener("resize", handleReposition);
        window.addEventListener("scroll", handleReposition, true);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            window.removeEventListener("resize", handleReposition);
            window.removeEventListener("scroll", handleReposition, true);
        };
    }, [isOpen]);

    function handleSelect(slug: string) {
        setIsOpen(false);
        navigate(`/w/${slug}`);
    }

    if (isPending) {
        return <div className="flex justify-center items-center h-9 text-xs text-muted-foreground">Loading...</div>;
    }

    return (
        <div className="relative w-full">
            <button
                ref={triggerRef}
                onClick={toggleOpen}
                className="w-full h-9 px-2.5 flex items-center justify-between gap-2 rounded-md bg-surface border border-border text-sm text-foreground hover:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all cursor-pointer"
            >
                <span className="truncate">{currentWorkspace?.name ?? "Select workspace"}</span>
                <ChevronDown className={`size-3.5 flex-shrink-0 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </button>

            {isOpen && createPortal(
                <div
                    ref={panelRef}
                    style={{ position: "fixed", top: position.top, left: position.left }}
                    className="z-50 w-72 max-w-[calc(100vw-2rem)] rounded-md border border-border bg-surface shadow-lg overflow-hidden"
                >
                    <div className="max-h-80 overflow-y-auto py-1">
                        {dropDownData.map((group) => (
                            <div key={group.role} className="px-1 py-1">
                                <span className="block px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                                    {group.role}
                                </span>
                                {group.workspace.map((workspace) => {
                                    const isSelected = workspace.slug === workspaceSlug;
                                    return (
                                        <button
                                            key={workspace.slug}
                                            onClick={() => handleSelect(workspace.slug)}
                                            className={`w-full flex items-center justify-between gap-2 px-2.5 h-8 rounded-md text-sm text-left cursor-pointer transition-colors ${isSelected
                                                ? "bg-primary/10 text-primary"
                                                : "text-foreground hover:bg-sidebar-border/60"
                                                }`}
                                        >
                                            <span className="truncate">{workspace.name}</span>
                                            {isSelected && <Check className="size-3.5 flex-shrink-0" />}
                                        </button>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};