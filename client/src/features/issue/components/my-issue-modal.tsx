import { useParams } from "react-router";
import { useCurrentWorkspace } from "../../workspace/query/useCurrentWorkspace";
import { useCurrentProject } from "../../project/query/useCurrentProject";
import { useMyIssues } from "../queries/useMyIssues";
import { useAllProjects } from "../../project/query/useAllProjects";
import { useMemo, useState } from "react";

export const MyIssuesModal = () => {
    const { projectSlug, workspaceSlug } = useParams();
    const { data: workspaceData } = useCurrentWorkspace(workspaceSlug!);
    const { data: allProjectsData } = useAllProjects(workspaceData?.data?.id!);
    const { data: projectData } = useCurrentProject(projectSlug!, workspaceData?.data?.id!);
    const { data: myIssuesData, isPending } = useMyIssues(workspaceData?.data?.id!, projectData?.data?.id!);

    const totalProjects = useMemo(() => {
        const issues = myIssuesData?.data || [];
        const filteredIssues = new Set(issues.map((issue) => issue.project.id));
        return filteredIssues.size;
    }, [myIssuesData?.data, allProjectsData?.data]);

    if (isPending) {
        return <div className="w-full h-full flex justify-center items-center">
            Loading your issues
        </div>
    }

    return (
        <div>
            <h4 className="text-sm">Inbox</h4>
            <h1 className="text-2xl">My Issues</h1>
            <h1>{`${myIssuesData?.data?.length} issues across ${totalProjects} projects`}</h1>
        </div>
    )

}