import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate, useParams } from "react-router";
import { ChevronDown, Check, Layers } from "lucide-react";
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
        return (
            <div className="flex justify-center items-center h-9 text-[11px] font-mono text-muted-foreground/60 tracking-wide">
                Loading...
            </div>
        );
    }

    return (
        <div className="relative w-full">
            <button
                ref={triggerRef}
                onClick={toggleOpen}
                className="w-full h-9 px-3 flex items-center justify-between gap-2 rounded-md bg-surface/50 border border-border/60 text-sm text-foreground hover:border-primary/40 hover:bg-surface/80 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all cursor-pointer group"
            >
                <div className="flex items-center gap-2.5 min-w-0">
                    <Layers className="size-3.5 flex-shrink-0 text-muted-foreground/50 group-hover:text-primary/60 transition-colors" strokeWidth={1.8} />
                    <span className="truncate text-[13px] font-medium tracking-tight">
                        {currentWorkspace?.name ?? "Select workspace"}
                    </span>
                </div>
                <ChevronDown className={`size-3.5 flex-shrink-0 text-muted-foreground/50 group-hover:text-foreground/70 transition-all duration-200 ${isOpen ? "rotate-180" : ""}`} strokeWidth={1.8} />
            </button>

            {isOpen && createPortal(
                <div
                    ref={panelRef}
                    style={{ position: "fixed", top: position.top, left: position.left }}
                    className="z-50 w-72 max-w-[calc(100vw-2rem)] rounded-md border border-border/60 bg-card/95 backdrop-blur-sm shadow-[0_8px_30px_rgb(0,0,0,0.08)] overflow-hidden"
                >
                    {/* Panel header with subtle grid */}
                    <div className="relative">
                        <div
                            className="absolute inset-0 opacity-[0.02] pointer-events-none"
                            style={{
                                backgroundImage: `
                                    linear-gradient(oklch(1 0 0 / 1) 1px, transparent 1px),
                                    linear-gradient(90deg, oklch(1 0 0 / 1) 1px, transparent 1px)
                                `,
                                backgroundSize: "20px 20px",
                            }}
                        />
                        <div className="relative max-h-80 overflow-y-auto py-1.5">
                            {dropDownData.map((group) => (
                                <div key={group.role} className="px-1.5 py-1">
                                    <div className="flex items-center gap-2 px-2.5 py-1.5 mb-0.5">
                                        <span className="text-[9px] font-mono tracking-[0.14em] text-muted-foreground/50 uppercase">
                                            {group.role}
                                        </span>
                                        <span className="flex-1 h-px bg-border/40" />
                                    </div>
                                    {group.workspace.map((workspace) => {
                                        const isSelected = workspace.slug === workspaceSlug;
                                        return (
                                            <button
                                                key={workspace.slug}
                                                onClick={() => handleSelect(workspace.slug)}
                                                className={`w-full flex items-center justify-between gap-2 px-2.5 h-8 rounded-md text-sm text-left cursor-pointer transition-all group-item ${isSelected
                                                    ? "bg-primary/10 text-primary border border-primary/20"
                                                    : "text-foreground/80 hover:bg-surface/60 hover:text-foreground"
                                                    }`}
                                            >
                                                <span className="truncate text-[13px] font-medium tracking-tight">
                                                    {workspace.name}
                                                </span>
                                                {isSelected && (
                                                    <Check className="size-3.5 flex-shrink-0 text-primary" strokeWidth={2.5} />
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Panel footer */}
                    <div className="border-t border-border/40 px-3 py-2 bg-sidebar/30">
                        <div className="flex items-center justify-between text-[8px] font-mono tracking-[0.12em] text-muted-foreground/30 uppercase">
                            <span>Switch workspace</span>
                            <span>v.2.0.1</span>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};