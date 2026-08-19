import { useParams } from "react-router";
import { useCurrentWorkspace } from "../../workspace/query/useCurrentWorkspace";
import { useCurrentProject } from "../../project/query/useCurrentProject";
import { useMyIssues } from "../queries/useMyIssues";
import { useAllProjects } from "../../project/query/useAllProjects";
import { useMemo } from "react";
import { IssueCard } from "./issue-card";
import type { IssueCardIssue } from "./issue-card";
import { Loader2, Filter, Layers } from "lucide-react";

type MyIssueListItem = IssueCardIssue & {
    project: {
        id: string;
        name: string;
    };
};

export const MyIssuesModal = () => {
    const { projectSlug, workspaceSlug } = useParams();
    const { data: workspaceData } = useCurrentWorkspace(workspaceSlug!);
    const { data: allProjectsData } = useAllProjects(workspaceData?.data?.id!);
    const { data: projectData } = useCurrentProject(projectSlug!, workspaceData?.data?.id!);
    const { data: myIssuesData, isPending } = useMyIssues(workspaceData?.data?.id!, projectData?.data?.id!);

    const totalProjects = useMemo(() => {
        const issues = (myIssuesData?.data ?? []) as MyIssueListItem[];
        const filteredIssues = new Set(issues.map((issue) => issue.project.id));
        return filteredIssues.size;
    }, [myIssuesData?.data, allProjectsData?.data]);

    const groupedIssues = useMemo(() => {
        const map = new Map<string, IssueCardIssue[]>();
        if (!myIssuesData?.data) return new Map();
        const issues = myIssuesData.data as MyIssueListItem[];

        issues.forEach((issue) => {
            const projectName = issue.project.name;
            if (!map.has(projectName)) {
                map.set(projectName, []);
            };
            map.get(projectName)?.push(issue);
        });

        return map;

    }, [myIssuesData?.data]);

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
                                {myIssuesData?.data?.length || 0} total
                            </span>
                        </div>

                        <h1 className="text-[1.5rem] md:text-[1.65rem] font-semibold tracking-[-0.03em] leading-tight">
                            My Issues
                        </h1>
                        <p className="text-[13.5px] text-muted-foreground mt-1.5 leading-relaxed">
                            <span className="text-foreground font-medium">
                                {myIssuesData?.data?.length || 0}
                            </span>{" "}
                            issues across{" "}
                            <span className="text-foreground font-medium">
                                {totalProjects}
                            </span>{" "}
                            {totalProjects === 1 ? "project" : "projects"}
                        </p>
                    </div>

                    {/* Filter — same kbd-tag pattern as the Navbar search */}
                    <button className="group inline-flex items-center gap-2 border border-border/80 bg-card px-3.5 h-9 text-[12px] font-medium text-foreground/80 transition-colors hover:border-border hover:bg-surface/40 shrink-0">
                        <Filter className="size-3.5 text-muted-foreground/60 group-hover:text-foreground/80 transition-colors" strokeWidth={1.8} />
                        <span>Filter</span>
                        <kbd className="text-[10px] font-mono text-muted-foreground/40 bg-border/30 px-1.5 py-0.5 rounded border border-border/40">
                            ⌘F
                        </kbd>
                    </button>
                </div>
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
                        No issues assigned to you
                    </p>
                    <p className="text-[10px] font-mono text-muted-foreground/40 tracking-wide">
                        All clear
                    </p>
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
                        {myIssuesData?.data?.length || 0} assigned
                    </span>
                </div>
            </div>
        </div>
    );
};