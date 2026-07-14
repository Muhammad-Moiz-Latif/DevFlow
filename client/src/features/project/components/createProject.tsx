import { ArrowRight } from "lucide-react";
import { useState, type Dispatch, type SetStateAction } from "react";
import { useNavigate } from "react-router";

export const CreateProjectModal = ({ setIsCreateModalOpen, workspaceId }: { setIsCreateModalOpen: Dispatch<SetStateAction<boolean>>, workspaceId: string }) => {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    function handleSubmit() {

    };
    return (
        <div
            className="w-full h-screen rounded-md absolute inset-0 bg-black/50 backdrop-blur-xs flex justify-center items-center"
        >
            <div
                className="w-1/2 h-[90%] rounded-md bg-background flex flex-col justify-start p-4"
            >
                <div className="flex justify-between">
                    <button onClick={() => setIsCreateModalOpen(false)} className="inline-flex hover:cursor-pointer items-center gap-2 mb-8 group">
                        <div className="size-7 rounded-md bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground font-semibold text-xs">
                            DF
                        </div>
                        <span className="text-sm font-semibold tracking-tight">DevFlow</span>
                    </button>
                    <button onClick={() => setIsCreateModalOpen(false)} className="inline-flex hover:cursor-pointer items-center gap-2 mb-8 group">
                        Go back
                    </button>
                </div>
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-semibold tracking-tight">Create your project</h1>
                    <p className="text-sm text-muted-foreground mt-2 text-center">
                        Projects help your team organize issues, milestones, and day-to-day work inside a workspace.
                        Create a new project to keep work focused and easy to track.
                    </p>
                </div>

                <form className="bg-card border border-border rounded-lg p-6 mb-6">

                    <div className="space-y-4">
                        <div>
                            <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider block mb-1.5">
                                Project name
                            </label>
                            <input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Customer Portal"
                                className="w-full h-9 px-3 rounded-md bg-surface border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                            />
                        </div>
                        <div>
                            <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider block mb-1.5">
                                Project description
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={5}
                                placeholder="Organize feature work, priorities, and owner assignments for the customer portal."
                                className="w-full px-3 py-1 rounded-md bg-surface border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        // disabled={!slug}
                        className="mt-5 hover:cursor-pointer inline-flex items-center justify-center gap-2 w-full h-10 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
                    >
                        Create project
                        <ArrowRight className="size-4" />
                    </button>
                </form>
            </div>
        </div>
    )
}