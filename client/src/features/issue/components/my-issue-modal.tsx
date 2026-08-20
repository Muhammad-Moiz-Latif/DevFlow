import { useParams } from "react-router";
import { useCurrentWorkspace } from "../../workspace/query/useCurrentWorkspace";
import { useCurrentProject } from "../../project/query/useCurrentProject";
import { useMyIssues } from "../queries/useMyIssues";
import { useAllProjects } from "../../project/query/useAllProjects";
import { useMemo, useState } from "react";
import { IssueCard } from "./issue-card";
import type { IssueCardIssue } from "./issue-card";
import { Loader2, Filter, Layers, ChevronDown, X } from "lucide-react";

type MyIssueListItem = IssueCardIssue & {
    project: {
        id: string;
        name: string;
    };
};

type Priority = 'URGENT' | 'HIGH' | 'MEDIUM' | 'LOW';
type Status = 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE';

const PRIORITY_OPTIONS: Priority[] = ['URGENT', 'HIGH', 'MEDIUM', 'LOW'];
const STATUS_OPTIONS: Status[] = ['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE'];

const formatPriority = (p: Priority) => p.charAt(0) + p.slice(1).toLowerCase();
const formatStatus = (s: Status) => s.replace('_', ' ').toLowerCase();

export const MyIssuesModal = () => {
    const { projectSlug, workspaceSlug } = useParams();
    const { data: workspaceData } = useCurrentWorkspace(workspaceSlug!);
    const { data: allProjectsData } = useAllProjects(workspaceData?.data?.id!);
    const { data: projectData } = useCurrentProject(projectSlug!, workspaceData?.data?.id!);
    const { data: myIssuesData, isPending } = useMyIssues(workspaceData?.data?.id!, projectData?.data?.id!);

    const [selectedPriorities, setSelectedPriorities] = useState<Set<Priority>>(new Set());
    const [selectedStatuses, setSelectedStatuses] = useState<Set<Status>>(new Set());
    const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);

    const totalProjects = useMemo(() => {
        const issues = (myIssuesData?.data ?? []) as MyIssueListItem[];
        const filteredIssues = new Set(issues.map((issue) => issue.project.id));
        return filteredIssues.size;
    }, [myIssuesData?.data, allProjectsData?.data]);

    const togglePriority = (priority: Priority) => {
        setSelectedPriorities((prev) => {
            const next = new Set(prev);
            if (next.has(priority)) {
                next.delete(priority);
            } else {
                next.add(priority);
            }
            return next;
        });
    };

    const toggleStatus = (status: Status) => {
        setSelectedStatuses((prev) => {
            const next = new Set(prev);
            if (next.has(status)) {
                next.delete(status);
            } else {
                next.add(status);
            }
            return next;
        });
    };

    const filteredIssues = useMemo(() => {
        if (!myIssuesData?.data) return [];
        const issues = myIssuesData.data as MyIssueListItem[];

        return issues.filter((issue) => {
            const matchesPriority = selectedPriorities.size === 0 || selectedPriorities.has(issue.priority as Priority);
            const matchesStatus = selectedStatuses.size === 0 || selectedStatuses.has(issue.status as Status);
            return matchesPriority && matchesStatus;
        });
    }, [myIssuesData?.data, selectedPriorities, selectedStatuses]);

    const groupedIssues = useMemo(() => {
        const map = new Map<string, IssueCardIssue[]>();
        if (!filteredIssues.length) return new Map();

        filteredIssues.forEach((issue) => {
            const projectName = issue.project.name;
            if (!map.has(projectName)) {
                map.set(projectName, []);
            }
            map.get(projectName)?.push(issue);
        });

        return map;
    }, [filteredIssues]);

    const activeFilterCount = selectedPriorities.size + selectedStatuses.size;
    const hasActiveFilters = activeFilterCount > 0;

    const handleResetFilters = () => {
        setSelectedPriorities(new Set());
        setSelectedStatuses(new Set());
        setIsFilterDropdownOpen(false);
    };

    // Flattened list of active filter chips, each independently removable
    const activeFilterChips = [
        ...Array.from(selectedPriorities).map((priority) => ({
            key: `priority-${priority}`,
            label: `Priority: ${formatPriority(priority)}`,
            onRemove: () => togglePriority(priority),
        })),
        ...Array.from(selectedStatuses).map((status) => ({
            key: `status-${status}`,
            label: `Status: ${formatStatus(status)}`,
            onRemove: () => toggleStatus(status),
        })),
    ];

    const issueContainers = Array.from(groupedIssues.entries()).map(([projectName, issues]: [string, IssueCardIssue[]]) => (
        <section key={projectName} className="border border-border bg-card overflow-hidden">
            {/* Project header — same instrument-strip pattern as the Dashboard panels */}
            <div className="h-9 border-b border-border bg-sidebar/40 flex items-center px-3.5 gap-2.5">
                <Layers className="size-3.5 text-muted-foreground/50" strokeWidth={1.8} />
                <span className="text-[10px] font-mono tracking-wide text-muted-foreground/60 uppercase">
                    {projectName}
                </span>
                <span className="text-[10px] font-mono text-foreground/70">
                    {issues.length}
                </span>
            </div>

            {/* Issue list */}
            <div className="divide-y divide-border">
                {issues.map((issue) => (
                    <IssueCard key={issue.id} issue={issue} />
                ))}
            </div>
        </section>
    ));

    if (isPending) {
        return (
            <div className="w-full h-full flex justify-center items-center min-h-[60vh]">
                <div className="flex items-center gap-2.5 border border-border bg-card px-5 py-3">
                    <Loader2 className="size-3.5 animate-spin text-primary" />
                    <span className="text-[12px] font-mono tracking-wide text-muted-foreground">
                        Loading your issues…
                    </span>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4 max-w-6xl mx-auto p-5 md:p-6">
            {/* ── Title block — matches Dashboard exactly ── */}
            <div className="relative mb-3 pb-5 border-b border-border">
                <div className="absolute top-0 left-0 size-2 border-t border-l border-primary/40" />
                <div className="absolute top-0 right-0 size-2 border-t border-r border-primary/40" />

                <div className="flex items-end justify-between gap-4">
                    <div className="min-w-0">
                        <div className="inline-flex items-center gap-3 mb-3 text-[10px] font-mono tracking-[0.14em] text-muted-foreground/55 uppercase">
                            <span className="w-4 h-px bg-border" />
                            Fig. 11 — My Issues
                            <span className="w-4 h-px bg-border" />
                            <span className="text-muted-foreground/40">Inbox</span>
                            <span className="w-px h-2.5 bg-border/50" />
                            <span className="flex items-center gap-1.5 text-primary/70 normal-case tracking-wide">
                                <span className="size-1 rounded-full bg-primary animate-pulse" />
                                {filteredIssues.length} total
                            </span>
                        </div>

                        <h1 className="text-[1.5rem] md:text-[1.65rem] font-semibold tracking-[-0.03em] leading-tight">
                            My Issues
                        </h1>
                        <p className="text-[13.5px] text-muted-foreground mt-1.5 leading-relaxed">
                            <span className="text-foreground font-medium">
                                {filteredIssues.length}
                            </span>{" "}
                            issues across{" "}
                            <span className="text-foreground font-medium">
                                {groupedIssues.size}
                            </span>{" "}
                            {groupedIssues.size === 1 ? "project" : "projects"}
                            {hasActiveFilters && (
                                <span className="ml-2 text-[11px] font-mono text-muted-foreground/50">
                                    • {activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''} active
                                </span>
                            )}
                        </p>
                    </div>

                    {/* Filter dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setIsFilterDropdownOpen((prev) => !prev)}
                            className="group inline-flex items-center gap-2 border border-border/80 bg-card px-3.5 h-9 text-[12px] font-medium text-foreground/80 transition-colors hover:border-border hover:bg-surface/40 shrink-0 relative"
                        >
                            <Filter className="size-3.5 text-muted-foreground/60 group-hover:text-foreground/80 transition-colors" strokeWidth={1.8} />
                            <span>Filter</span>
                            {activeFilterCount > 0 && (
                                <span className="absolute -top-1 -right-1 size-4 bg-primary rounded-full text-[8px] font-mono text-primary-foreground flex items-center justify-center">
                                    {activeFilterCount}
                                </span>
                            )}
                            <ChevronDown className={`size-3 text-muted-foreground/50 transition-transform duration-200 ${isFilterDropdownOpen ? 'rotate-180' : ''}`} strokeWidth={1.8} />
                        </button>

                        {/* Filter Dropdown Menu */}
                        {isFilterDropdownOpen && (
                            <div className="absolute right-0 top-full mt-2 z-50 min-w-[260px] bg-surface/95 backdrop-blur-md border border-border/60 rounded-lg shadow-lg overflow-hidden">
                                <div className="p-2 space-y-2 max-h-[360px] overflow-y-auto">
                                    {/* Priority group — multi-select checkboxes */}
                                    <div>
                                        <div className="px-2 py-1.5 text-[9px] font-mono tracking-[0.1em] text-muted-foreground/40 uppercase flex items-center justify-between">
                                            <span>Priority</span>
                                            {selectedPriorities.size > 0 && (
                                                <button
                                                    onClick={() => setSelectedPriorities(new Set())}
                                                    className="normal-case tracking-normal text-primary/60 hover:text-primary transition-colors"
                                                >
                                                    clear
                                                </button>
                                            )}
                                        </div>
                                        <div className="space-y-0.5">
                                            {PRIORITY_OPTIONS.map((priority) => {
                                                const checked = selectedPriorities.has(priority);
                                                return (
                                                    <button
                                                        key={priority}
                                                        onClick={() => togglePriority(priority)}
                                                        className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-md text-[12px] transition-colors ${checked ? 'bg-primary/10 text-foreground' : 'text-muted-foreground/70 hover:text-foreground hover:bg-surface/40'}`}
                                                    >
                                                        <span className={`size-3.5 rounded border flex items-center justify-center shrink-0 transition-colors ${checked ? 'bg-primary border-primary' : 'border-border/70'}`}>
                                                            {checked && <span className="size-1.5 rounded-sm bg-primary-foreground" />}
                                                        </span>
                                                        <span>{formatPriority(priority)}</span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <div className="w-full h-px bg-border/40" />

                                    {/* Status group — multi-select checkboxes */}
                                    <div>
                                        <div className="px-2 py-1.5 text-[9px] font-mono tracking-[0.1em] text-muted-foreground/40 uppercase flex items-center justify-between">
                                            <span>Status</span>
                                            {selectedStatuses.size > 0 && (
                                                <button
                                                    onClick={() => setSelectedStatuses(new Set())}
                                                    className="normal-case tracking-normal text-primary/60 hover:text-primary transition-colors"
                                                >
                                                    clear
                                                </button>
                                            )}
                                        </div>
                                        <div className="space-y-0.5">
                                            {STATUS_OPTIONS.map((status) => {
                                                const checked = selectedStatuses.has(status);
                                                return (
                                                    <button
                                                        key={status}
                                                        onClick={() => toggleStatus(status)}
                                                        className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-md text-[12px] transition-colors capitalize ${checked ? 'bg-primary/10 text-foreground' : 'text-muted-foreground/70 hover:text-foreground hover:bg-surface/40'}`}
                                                    >
                                                        <span className={`size-3.5 rounded border flex items-center justify-center shrink-0 transition-colors ${checked ? 'bg-primary border-primary' : 'border-border/70'}`}>
                                                            {checked && <span className="size-1.5 rounded-sm bg-primary-foreground" />}
                                                        </span>
                                                        <span>{formatStatus(status)}</span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <div className="w-full h-px bg-border/40" />

                                    {/* Reset all */}
                                    <button
                                        onClick={handleResetFilters}
                                        disabled={!hasActiveFilters}
                                        className="w-full flex items-center justify-center gap-2 px-3 py-1.5 rounded-md text-[11px] text-muted-foreground/50 hover:text-foreground hover:bg-surface/40 transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-muted-foreground/50"
                                    >
                                        <X className="size-3" strokeWidth={1.8} />
                                        <span>Reset all filters</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Active filter chips — each independently removable */}
                {hasActiveFilters && (
                    <div className="flex flex-wrap items-center gap-1.5 mt-3.5">
                        {activeFilterChips.map((chip) => (
                            <button
                                key={chip.key}
                                onClick={chip.onRemove}
                                className="group inline-flex items-center gap-1.5 border border-border/60 bg-primary/5 px-2.5 h-6 rounded-full text-[10.5px] font-medium text-foreground/75 hover:border-destructive/40 hover:bg-destructive/10 hover:text-destructive transition-all"
                            >
                                <span>{chip.label}</span>
                                <X className="size-2.5 opacity-50 group-hover:opacity-100 transition-opacity" strokeWidth={2} />
                            </button>
                        ))}
                        <button
                            onClick={handleResetFilters}
                            className="text-[10.5px] font-mono text-muted-foreground/50 hover:text-primary transition-colors ml-1"
                        >
                            Clear all
                        </button>
                    </div>
                )}
            </div>

            {/* ── Issue containers ── */}
            {issueContainers.length > 0 ? (
                <div className="space-y-4">
                    {issueContainers}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 gap-1.5 border border-dashed border-border bg-sidebar/25">
                    <Layers className="size-6 text-muted-foreground/25" strokeWidth={1.5} />
                    <p className="text-[13px] text-muted-foreground/60 tracking-tight">
                        {hasActiveFilters ? 'No issues match the current filters' : 'No issues assigned to you'}
                    </p>
                    {hasActiveFilters && (
                        <button
                            onClick={handleResetFilters}
                            className="text-[10px] font-mono text-primary/70 hover:text-primary transition-colors"
                        >
                            Clear filters →
                        </button>
                    )}
                    {!hasActiveFilters && (
                        <p className="text-[10px] font-mono text-muted-foreground/40 tracking-wide">
                            All clear
                        </p>
                    )}
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
                        <span className="size-1 rounded-full bg-status-done" />
                        {filteredIssues.length} assigned
                    </span>
                    {hasActiveFilters && (
                        <>
                            <span className="w-px h-2 bg-border/40" />
                            <span className="flex items-center gap-1.5 text-primary/60">
                                filtered
                            </span>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};