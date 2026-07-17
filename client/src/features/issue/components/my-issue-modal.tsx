import { useParams } from "react-router";
import { useCurrentWorkspace } from "../../workspace/query/useCurrentWorkspace";
import { useCurrentProject } from "../../project/query/useCurrentProject";
import { useMyIssues } from "../queries/useMyIssues";
import { useAllProjects } from "../../project/query/useAllProjects";
import { useMemo } from "react";
import { IssueCard } from "./issue-card";
import type { IssueCardIssue } from "./issue-card";

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
        <section key={projectName} className="overflow-hidden rounded-2xl border border-border bg-background/65 shadow-[0_1px_0_rgba(255,255,255,0.02)] backdrop-blur-sm">
            <div className="flex items-center justify-between gap-4 border-b border-border px-4 py-3">
                <div>
                    <h1 className="text-sm font-semibold uppercase text-muted-foreground">{projectName}</h1>
                </div>
                <span className="text-sm text-muted-foreground">{issues.length}</span>
            </div>
            <div>
                {issues.map((issue) => (
                    <IssueCard key={issue.id} issue={issue} />
                ))}
            </div>
        </section>
    ));


    if (isPending) {
        return <div className="w-full h-full flex justify-center items-center">
            Loading your issues
        </div>
    }

    return (
        <div className="space-y-5">
            <div className="space-y-2">
                <h4 className="text-sm text-muted-foreground">Inbox</h4>
                <div className="flex items-end justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-semibold tracking-tight text-foreground">My Issues</h1>
                        <h2 className="mt-2 text-sm text-muted-foreground">{`${myIssuesData?.data?.length} issues across ${totalProjects} projects`}</h2>
                    </div>
                    <button className="inline-flex items-center gap-2 rounded-xl border border-border/60 bg-background/70 px-4 py-3 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-background">
                        <span className="size-4 rounded-sm border border-current/60" />
                        Filter
                    </button>
                </div>
            </div>
            <div className="space-y-6">
                {issueContainers}
            </div>
        </div>
    )
}