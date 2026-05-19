import { useParams } from "react-router"
import { useCurrentWorkspace } from "../../workspace/query/useCurrentWorkspace";
import { useCurrentProject } from "../query/useCurrentProject";
import { useIssuesInCurrentProject } from "../query/useIssuesInCurrentProject";

export const KanbanComponent = () => {
    const { projectSlug, workspaceSlug } = useParams();
    const { data: workspaceData, isPending: isWorkspacePending } = useCurrentWorkspace(workspaceSlug!);
    const { data: projectData, isPending: isProjectPending } = useCurrentProject(projectSlug!, workspaceData?.data?.id!);
    const { data: issuesData, isPending: areIssuesPending } = useIssuesInCurrentProject(workspaceData?.data?.id!, projectData?.data?.id!);

    console.log(projectData?.data?.id);
    if (isWorkspacePending || isProjectPending || areIssuesPending) {
        return <div>
            Loading...
        </div>
    };

    console.log(issuesData?.data);
    return (
        <div className="p-4">
            <h1>Projects / enter project name</h1>
            <h1>Project name bigger size</h1>
            <div className="flex justify-between">
                <div>To Do</div>
                <div>In Progress</div>
                <div>In Review</div>
                <div>Done</div>
            </div>
        </div>
    )
}