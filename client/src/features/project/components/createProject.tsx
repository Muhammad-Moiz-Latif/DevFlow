import { ArrowRight, X } from "lucide-react";
import { useState, type Dispatch, type SetStateAction } from "react";
import { useCreateProject } from "../query/useCreateProject";
import { successToast } from "../../../components/ui/CustomToasts";

export const CreateProjectModal = ({ setIsCreateModalOpen, workspaceId }: { setIsCreateModalOpen: Dispatch<SetStateAction<boolean>>, workspaceId: string }) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [errors, setErrors] = useState<{ name?: string; description?: string }>({});
    const { mutate, isPending } = useCreateProject(workspaceId);

    function validateForm(): boolean {
        const newErrors: { name?: string; description?: string } = {};

        if (!name.trim()) {
            newErrors.name = "Project name is required";
        }

        if (!description.trim()) {
            newErrors.description = "Description is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        mutate({
            data: {
                name: name.trim(),
                description: description.trim(),
                workspaceId
            }
        }, {
            onSuccess: () => {
                successToast('Project created successfully'),
                    setTimeout(() => { setIsCreateModalOpen(false) }, 1000)
            },
            onError: () => {
                successToast('Project could not be created'),
                    setTimeout(() => { setIsCreateModalOpen(false) }, 1000)
            }
        })
    };

    return (
        <div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-center items-center p-4"
        >
            <div className="relative w-full max-w-lg border border-border bg-card">
                {/* Registration marks */}
                <div className="absolute -top-px -left-px size-2 border-t border-l border-primary/40" />
                <div className="absolute -top-px -right-px size-2 border-t border-r border-primary/40" />

                {/* Title block — same language as the board / activity panels */}
                <div className="h-9 border-b border-border bg-sidebar/40 flex items-center px-3.5 gap-2.5">
                    <span className="text-[10px] font-mono tracking-wide text-muted-foreground/60 uppercase">
                        New Entry
                    </span>
                    <span className="text-[10px] font-mono text-foreground/70">
                        Fig. 13 — Project
                    </span>
                    <button
                        onClick={() => setIsCreateModalOpen(false)}
                        className="ml-auto p-1 -mr-1 text-muted-foreground/60 hover:text-foreground transition-colors"
                        aria-label="Close"
                    >
                        <X className="size-3.5" strokeWidth={1.8} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-5">
                    <div className="inline-flex items-center gap-3 mb-3 text-[10px] font-mono tracking-[0.14em] text-muted-foreground/55 uppercase">
                        <span className="w-4 h-px bg-border" />
                        {workspaceId.slice(0, 8).toUpperCase()}
                    </div>

                    <h2 className="text-[1.25rem] font-semibold tracking-[-0.02em] leading-tight">
                        Create project
                    </h2>
                    <p className="text-[13px] text-muted-foreground mt-1.5 leading-relaxed">
                        Projects organize issues, milestones, and day-to-day work inside this workspace.
                    </p>

                    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                        <div>
                            <label className="text-[10px] font-mono tracking-[0.1em] text-muted-foreground/50 uppercase block mb-1.5">
                                Project name
                            </label>
                            <input
                                value={name}
                                onChange={(e) => {
                                    setName(e.target.value);
                                    if (errors.name) {
                                        setErrors(prev => ({ ...prev, name: undefined }));
                                    }
                                }}
                                placeholder="Customer Portal"
                                className={`w-full h-9 px-3 rounded-md bg-surface border ${errors.name ? 'border-destructive/60 ring-1 ring-destructive/30' : 'border-border/70'} text-[13px] placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all`}
                            />
                            {errors.name && (
                                <p className="text-[10px] font-mono text-destructive/80 mt-1.5 tracking-wide">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="text-[10px] font-mono tracking-[0.1em] text-muted-foreground/50 uppercase block mb-1.5">
                                Description
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => {
                                    setDescription(e.target.value);
                                    if (errors.description) {
                                        setErrors(prev => ({ ...prev, description: undefined }));
                                    }
                                }}
                                rows={4}
                                placeholder="Organize feature work, priorities, and owner assignments for the customer portal."
                                className={`w-full px-3 py-2 rounded-md bg-surface border ${errors.description ? 'border-destructive/60 ring-1 ring-destructive/30' : 'border-border/70'} text-[13px] placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all resize-none`}
                            />
                            {errors.description && (
                                <p className="text-[10px] font-mono text-destructive/80 mt-1.5 tracking-wide">
                                    {errors.description}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isPending}
                            className="w-full h-10 bg-primary text-primary-foreground text-[13px] font-medium hover:bg-primary/90 inline-flex items-center justify-center gap-1.5 transition-colors border border-primary/70 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isPending ? "Creating…" : "Create project"}
                            <ArrowRight className="size-3.5 opacity-80" />
                        </button>
                    </form>
                </div>

                {/* Footer strip */}
                <div className="flex items-center justify-between px-5 pb-4 text-[9px] font-mono tracking-[0.12em] text-muted-foreground/30 uppercase">
                    <span>devflow.app</span>
                    <span>Esc to close</span>
                </div>
            </div>
        </div>
    )
};