import { useNavigate, useParams } from "react-router"
import { useCurrentWorkspace } from "../../workspace/query/useCurrentWorkspace";
import { useAllProjects } from "../query/useAllProjects";
import { Loader2 } from "lucide-react";
import { useMemo, useState } from "react";
import { CreateProjectModal } from "./createProject";

export const ProjectPage = () => {
    const { workspaceSlug } = useParams();
    const navigate = useNavigate();
    const { data: workspaceData, isPending } = useCurrentWorkspace(workspaceSlug!);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const { data: projectsData, isPending: pendingProjects } = useAllProjects(workspaceData?.data?.id!);
    const { theProjects, activeProjects, archivedProjects } = useMemo(() => {
        if (!projectsData?.data) {
            return { theProjects: [], activeProjects: 0, archivedProjects: 0 }
        };
        let activeProjects = 0;
        let archivedProjects = 0;
        const theProjects = projectsData?.data!.map((project) => {
            project.status === 'Active' ? activeProjects++ : archivedProjects++;
            return (
                <div
                    key={project.id}
                    onClick={() => navigate(`${project.slug}`)}
                    className="w-80 h-28 bg-zinc-900 hover:cursor-pointer hover:opacity-75 rounded-md p-3 border border-zinc-800"
                >
                    <div className="flex justify-between">
                        <h1 className="text-xl">{project.name}</h1>
                        <h1 className="text-xs">{project.status}</h1>
                    </div>
                    <p>{project.description}</p>
                </div>
            )
        });
        return { theProjects, activeProjects, archivedProjects };
    }, [projectsData?.data]);

    if (isPending || pendingProjects) {
        return (
            <div className="p-6 max-w-6xl mx-auto flex items-center justify-center min-h-screen ">
                <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="size-4 animate-spin" />
                    Loading projects...
                </div>
            </div>
        );
    };



    return (
        <div className="p-6">
            {isCreateModalOpen && <CreateProjectModal setIsCreateModalOpen={setIsCreateModalOpen} workspaceId={workspaceData?.data?.id || ""}/>}
            <h6 className="text-xs">Workspace</h6>
            <div
                className="flex justify-between"
            >
                <h1 className="text-2xl">Projects</h1>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="border border-muted-foreground px-3 py-1 rounded-md hover:opacity-50 hover:cursor-pointer"
                >Create Project</button>
            </div>
            <div className="flex gap-1 items-center">
                <h1>{activeProjects} active</h1>
                <h1>-</h1>
                <h1>{archivedProjects} archived</h1>
            </div>
            <div className="mt-5">
                {theProjects}
            </div>
        </div>
    )
};