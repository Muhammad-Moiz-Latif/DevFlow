import { useNavigate, useParams } from "react-router";
import { useCurrentWorkspace } from "../../workspace/query/useCurrentWorkspace";
import { useAllProjects } from "../query/useAllProjects";
import { Loader2, Plus, Layers, ArrowRight } from "lucide-react";
import { useMemo, useState } from "react";
import { CreateProjectModal } from "./createProject";

type ProjectType = {
    id: string;
    workspace_id: string;
    name: string;
    description: string;
    slug: string;
    status: "Active" | "Archived";
    created_by: string;
    created_at: Date;
    updated_at: Date;
};

export const ProjectPage = () => {
    const { workspaceSlug } = useParams();
    const navigate = useNavigate();
    const { data: workspaceData, isPending } = useCurrentWorkspace(workspaceSlug!);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const { data: projectsData, isPending: pendingProjects } = useAllProjects(
        workspaceData?.data?.id!
    );

    const { projects, activeCount, archivedCount, activeRate } = useMemo(() => {
        if (!projectsData?.data) {
            return { projects: [] as ProjectType[], activeCount: 0, archivedCount: 0, activeRate: 0 };
        }

        let active = 0;
        let archived = 0;

        projectsData.data.forEach((p: ProjectType) => {
            if (p.status === "Active") active++;
            else archived++;
        });

        const activeRate = projectsData.data.length > 0
            ? Math.round((active / projectsData.data.length) * 100)
            : 0;

        return {
            projects: projectsData.data as ProjectType[],
            activeCount: active,
            archivedCount: archived,
            activeRate,
        };
    }, [projectsData?.data]);

    if (isPending || pendingProjects || !workspaceData?.data) {
        return (
            <div className="p-6 max-w-6xl mx-auto flex items-center justify-center min-h-[60vh]">
                <div className="flex items-center gap-2.5 border border-border bg-card px-5 py-3">
                    <Loader2 className="size-3.5 animate-spin text-primary" />
                    <span className="text-[12px] font-mono tracking-wide text-muted-foreground">
                        Loading projects…
                    </span>
                </div>
            </div>
        );
    }

    return (
        <div className="p-5 md:p-6 max-w-6xl mx-auto">
            {isCreateModalOpen && (
                <CreateProjectModal
                    setIsCreateModalOpen={setIsCreateModalOpen}
                    workspaceId={workspaceData.data.id}
                />
            )}

            {/* ── Title block ── */}
            <div className="relative mb-7 pb-5 border-b border-border">
                <div className="absolute top-0 left-0 size-2 border-t border-l border-primary/40" />
                <div className="absolute top-0 right-0 size-2 border-t border-r border-primary/40" />

                <div className="flex items-start justify-between gap-4 pr-2 pt-2">
                    <div className="min-w-0">
                        <div className="inline-flex items-center gap-3 mb-3 text-[10px] font-mono tracking-[0.14em] text-muted-foreground/55 uppercase">
                            <span className="w-4 h-px bg-border" />
                            Fig. 12 — Projects
                            <span className="w-4 h-px bg-border" />
                            <span className="text-muted-foreground/40">Workspace</span>
                            <span className="w-px h-2.5 bg-border/50" />
                            <span className="flex items-center gap-1.5 text-primary/70 normal-case tracking-wide">
                                <span className="size-1 rounded-full bg-primary animate-pulse" />
                                {projects.length} total
                            </span>
                        </div>

                        <h1 className="text-[1.5rem] md:text-[1.65rem] font-semibold tracking-[-0.03em] leading-tight">
                            Projects
                        </h1>

                        <p className="text-[13.5px] text-muted-foreground mt-1.5 leading-relaxed">
                            <span className="text-foreground font-medium">{activeCount}</span>{" "}
                            active
                            {archivedCount > 0 && (
                                <>
                                    {" "}
                                    ·{" "}
                                    <span className="text-muted-foreground/80 font-medium">
                                        {archivedCount} archived
                                    </span>
                                </>
                            )}
                        </p>
                    </div>

                    {/* Create button */}
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="group inline-flex items-center gap-2 h-9 px-4 border border-border/80 bg-card text-[12px] font-medium text-foreground/85 hover:border-border hover:bg-surface/40 transition-colors shrink-0"
                    >
                        <Plus
                            className="size-3.5 text-muted-foreground/60 group-hover:text-foreground/80 transition-colors"
                            strokeWidth={1.8}
                        />
                        <span>Create project</span>
                    </button>
                </div>
            </div>

            {/* ── Instrument strip ── */}
            <div className="grid grid-cols-3 gap-px bg-border border border-border mb-6">
                <StatCell label="Total" value={projects.length} hint="All" tone="primary" />
                <DialCell value={activeRate} label="Active" total={projects.length} />
                <StatCell label="Archived" value={archivedCount} hint="Stored" tone="done" />
            </div>

            {/* ── Project grid ── */}
            {projects.length > 0 ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {projects.map((project) => (
                        <ProjectCard
                            key={project.id}
                            project={project}
                            onClick={() => navigate(`${project.slug}`)}
                        />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 gap-1.5 border border-dashed border-border bg-sidebar/25">
                    <Layers className="size-6 text-muted-foreground/25" strokeWidth={1.5} />
                    <p className="text-[13px] text-muted-foreground/60 tracking-tight">
                        No projects yet
                    </p>
                    <p className="text-[10px] font-mono text-muted-foreground/40 tracking-wide">
                        Create your first project to get started
                    </p>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="mt-4 h-9 px-4 bg-primary text-primary-foreground text-[13px] font-medium hover:bg-primary/90 inline-flex items-center gap-1.5 transition-colors border border-primary/70"
                    >
                        <Plus className="size-3.5" strokeWidth={2} />
                        Create project
                    </button>
                </div>
            )}

            {/* ── Sheet footer ── */}
            <div className="mt-6 flex items-center justify-between text-[9px] font-mono tracking-[0.12em] text-muted-foreground/30 uppercase border-t border-border/50 pt-3">
                <span>Sheet 01 / 01</span>
                <div className="flex items-center gap-2.5">
                    <span>v2.0.1</span>
                    <span className="w-px h-2 bg-border/40" />
                    <span>devflow.app</span>
                    <span className="w-px h-2 bg-border/40" />
                    <span className="flex items-center gap-1.5">
                        <span className="size-1 rounded-full bg-status-progress" />
                        {activeCount} active
                    </span>
                </div>
            </div>
        </div>
    );
};

/* ── Project card ── */
function ProjectCard({
    project,
    onClick,
}: {
    project: ProjectType;
    onClick: () => void;
}) {
    const isActive = project.status === "Active";

    return (
        <article
            onClick={onClick}
            className={`group relative border bg-card overflow-hidden cursor-pointer hover:bg-surface/30 transition-colors ${isActive ? "border-border" : "border-dashed border-border/70"
                }`}
        >
            {/* Header bar */}
            <div className="h-8 border-b border-border bg-sidebar/40 flex items-center px-3.5 gap-2.5">
                <span
                    className={`size-1.5 rounded-full ${isActive ? "bg-status-progress" : "bg-muted-foreground/40"
                        }`}
                />
                <span className="text-[10px] font-mono tracking-wide text-muted-foreground/60 uppercase">
                    {isActive ? "Active" : "Archived"}
                </span>
                <span className="ml-auto text-[9px] font-mono text-muted-foreground/40 tracking-wide">
                    {new Date(project.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "2-digit",
                    })}
                </span>
            </div>

            {/* Body */}
            <div className="p-3.5">
                <div className="flex items-start justify-between gap-2">
                    <h3 className="text-[14px] font-semibold tracking-tight text-foreground/90 group-hover:text-foreground line-clamp-1 transition-colors">
                        {project.name}
                    </h3>
                    <ArrowRight
                        className="size-3.5 text-primary/50 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-0.5"
                        strokeWidth={2}
                    />
                </div>

                {project.description ? (
                    <p className="text-[12px] text-muted-foreground/70 mt-1.5 line-clamp-2 leading-relaxed">
                        {project.description}
                    </p>
                ) : (
                    <p className="text-[12px] text-muted-foreground/40 mt-1.5 italic">
                        No description
                    </p>
                )}

                <div className="mt-3 flex items-center gap-2">
                    <span className="text-[9.5px] font-mono text-muted-foreground/50 tracking-wide">
                        {project.slug}
                    </span>
                </div>
            </div>
        </article>
    );
}

/* ── Stat cell ── */
function StatCell({
    label,
    value,
    hint,
    tone,
}: {
    label: string;
    value: number;
    hint: string;
    tone: "progress" | "urgent" | "done" | "primary";
}) {
    const toneClass = {
        progress: "text-status-progress",
        urgent: "text-priority-urgent",
        done: "text-status-done",
        primary: "text-primary",
    }[tone];

    return (
        <div className="bg-background px-4 py-3.5 hover:bg-surface/25 transition-colors">
            <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-mono tracking-[0.1em] text-muted-foreground/50 uppercase">
                    {label}
                </span>
                <span className={`text-[10px] font-mono ${toneClass}`}>{hint}</span>
            </div>
            <div className="text-[1.4rem] font-semibold tracking-[-0.02em] tabular-nums">
                {value}
            </div>
        </div>
    );
}

/* ── Dial cell — same signature instrument as the Dashboard ── */
function DialCell({ value, label, total }: { value: number; label: string; total: number }) {
    return (
        <div className="bg-background px-4 py-3.5 flex items-center gap-3 hover:bg-surface/25 transition-colors">
            <div
                className="relative size-10 shrink-0 rounded-full"
                style={{
                    background: `conic-gradient(oklch(0.72 0.20 290) ${value * 3.6}deg, oklch(1 0 0 / 0.08) 0deg)`,
                }}
            >
                <div className="absolute inset-[3px] rounded-full bg-background flex items-center justify-center">
                    <span className="text-[9px] font-mono font-semibold tabular-nums">
                        {value}%
                    </span>
                </div>
            </div>
            <div className="min-w-0">
                <span className="block text-[10px] font-mono tracking-[0.1em] text-muted-foreground/50 uppercase">
                    {label}
                </span>
                <span className="block text-[10px] font-mono text-muted-foreground/60 mt-1">
                    of {total} total
                </span>
            </div>
        </div>
    );
}