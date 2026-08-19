import { useState, type Dispatch, type SetStateAction, useRef } from "react";
import { X, ArrowRight, Calendar, User, AlertCircle, FileText } from "lucide-react";
import type { createIssueType } from "../../issue/apis/createissue";
import { useCreateIssue } from "../../issue/queries/useCreateIssue";
import { errorToast, successToast } from "../../../components/ui/CustomToasts";
import { useWorkspaceMembers } from "../../members/query/useWorkspaceMembers";


type CreateIssueModalProps = {
    workspaceId: string;
    projectId: string;
    status: 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE';
    setIsCreateModalOpen: Dispatch<SetStateAction<boolean>>;
};

const CreateIssueModal = ({
    workspaceId,
    projectId,
    status,
    setIsCreateModalOpen,
}: CreateIssueModalProps) => {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        priority: "MEDIUM" as const,
        assignee_id: "",
        due_date: "",
    });
    const [errors, setErrors] = useState<{ title?: string }>({});
    const titleInputRef = useRef<HTMLInputElement>(null);

    const { mutate, isPending } = useCreateIssue(workspaceId, projectId);
    const { data } = useWorkspaceMembers(workspaceId);
    const membersData = data?.data!.map(member => {
        return (
            <option
                key={member.id}
                value={member.user.id}
            >
                {member.user.name}
            </option >
        )
    });

    const validateForm = (): boolean => {
        const newErrors: { title?: string } = {};

        if (!formData.title.trim()) {
            newErrors.title = "Title is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        // Clear error when user types
        if (name === 'title' && errors.title) {
            setErrors({});
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            // Focus the title input if there's an error
            if (errors.title && titleInputRef.current) {
                titleInputRef.current.focus();
            }
            return;
        }

        const payload: createIssueType = {
            workspaceId,
            projectId,
            issue: {
                title: formData.title,
                description: formData.description,
                status,
                priority: formData.priority as "URGENT" | "HIGH" | "MEDIUM" | "LOW",
                assignee_id: formData.assignee_id || undefined,
                due_date: formData.due_date ? new Date(formData.due_date) : undefined,
            },
        };

        mutate(payload, {
            onSuccess: () => {
                successToast("Created issue");
                setTimeout(() => setIsCreateModalOpen(false), 1000);
            },
            onError: () => {
                errorToast('Could not create issue');
                setTimeout(() => setIsCreateModalOpen(false), 1000);
            }
        })
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={() => setIsCreateModalOpen(false)}
            />

            {/* Modal - increased width */}
            <div className="relative z-50 w-full max-w-lg bg-background border border-border/60 rounded-md shadow-[0_8px_30px_rgb(0,0,0,0.12)] max-h-[90vh] overflow-y-auto overflow-x-hidden">
                {/* Registration marks */}
                <div className="absolute -top-px -left-px size-2 border-t border-l border-primary/40" />
                <div className="absolute -top-px -right-px size-2 border-t border-r border-primary/40" />

                {/* Header with drafting aesthetic */}
                <div className="h-9 border-b border-border/60 bg-sidebar/40 flex items-center px-3.5 gap-2.5">
                    <span className="text-[10px] font-mono tracking-wide text-muted-foreground/60 uppercase">
                        New Entry
                    </span>
                    <span className="text-[10px] font-mono text-foreground/70">
                        Fig. 14 — Issue
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
                <div className="p-6">
                    <div className="inline-flex items-center gap-3 mb-3 text-[10px] font-mono tracking-[0.14em] text-muted-foreground/55 uppercase">
                        <span className="w-4 h-px bg-border" />
                        {projectId.slice(0, 8).toUpperCase()}
                        <span className="w-4 h-px bg-border" />
                        <span className="text-muted-foreground/30">{status}</span>
                    </div>

                    <h2 className="text-[1.1rem] font-semibold tracking-[-0.02em] leading-tight">
                        Create new issue
                    </h2>
                    <p className="text-[12.5px] text-muted-foreground mt-1 leading-relaxed">
                        Add a new task to the {status.toLowerCase().replace('_', ' ')} column.
                    </p>

                    <form onSubmit={handleSubmit} className="mt-5 space-y-3.5">
                        {/* Title Field */}
                        <div>
                            <label className="text-[10px] font-mono tracking-[0.08em] text-muted-foreground/60 uppercase block mb-1">
                                Title <span className="text-destructive/60">*</span>
                            </label>
                            <div className="relative">
                                <FileText className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground/40" strokeWidth={1.8} />
                                <input
                                    ref={titleInputRef}
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="Issue title"
                                    className={`w-full h-9 pl-9 pr-3 bg-surface border rounded-md text-[13px] placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all ${errors.title
                                            ? 'border-destructive/60 ring-1 ring-destructive/30 focus:border-destructive/50'
                                            : 'border-border/60 focus:border-primary/50'
                                        }`}
                                />
                            </div>
                            {errors.title && (
                                <p className="text-[10px] font-mono text-destructive/80 mt-1.5 tracking-wide">
                                    {errors.title}
                                </p>
                            )}
                        </div>

                        {/* Description Field */}
                        <div>
                            <label className="text-[10px] font-mono tracking-[0.08em] text-muted-foreground/60 uppercase block mb-1">
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Issue description (optional)"
                                rows={2}
                                className="w-full px-3 py-2 bg-surface border border-border/60 rounded-md text-[13px] placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all resize-none"
                            />
                        </div>

                        {/* Grid for Priority and Due Date */}
                        <div className="grid grid-cols-2 gap-3">
                            {/* Priority Field */}
                            <div>
                                <label className="text-[10px] font-mono tracking-[0.08em] text-muted-foreground/60 uppercase block mb-1">
                                    Priority
                                </label>
                                <div className="relative">
                                    <AlertCircle className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground/40" strokeWidth={1.8} />
                                    <select
                                        name="priority"
                                        value={formData.priority}
                                        onChange={handleChange}
                                        className="w-full h-9 pl-9 pr-3 bg-surface border border-border/60 rounded-md text-[13px] text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all appearance-none"
                                    >
                                        <option value="LOW">Low</option>
                                        <option value="MEDIUM">Medium</option>
                                        <option value="HIGH">High</option>
                                        <option value="URGENT">Urgent</option>
                                    </select>
                                </div>
                            </div>

                            {/* Due Date Field */}
                            <div>
                                <label className="text-[10px] font-mono tracking-[0.08em] text-muted-foreground/60 uppercase block mb-1">
                                    Due Date
                                </label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground/40" strokeWidth={1.8} />
                                    <input
                                        type="date"
                                        name="due_date"
                                        value={formData.due_date}
                                        onChange={handleChange}
                                        className="w-full h-9 pl-9 pr-3 bg-surface border border-border/60 rounded-md text-[13px] text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Assignee Field */}
                        <div>
                            <label className="text-[10px] font-mono tracking-[0.08em] text-muted-foreground/60 uppercase block mb-1">
                                Assignee
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground/40" strokeWidth={1.8} />
                                <select
                                    value={formData.assignee_id}
                                    onChange={handleChange}
                                    name="assignee_id"
                                    className="w-full h-9 pl-9 pr-3 bg-surface border border-border/60 rounded-md text-[13px] text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all appearance-none"
                                >
                                    <option value="">Unassigned</option>
                                    {membersData}
                                </select>
                            </div>
                        </div>

                        {/* Status Display - Readonly */}
                        <div>
                            <label className="text-[10px] font-mono tracking-[0.08em] text-muted-foreground/60 uppercase block mb-1">
                                Status
                            </label>
                            <div className="h-9 px-3 bg-primary/5 border border-primary/20 rounded-md flex items-center text-[13px] text-primary/80 font-medium">
                                {status.replace('_', ' ')}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isPending}
                            className="group w-full h-10 mt-2 bg-primary text-primary-foreground text-[13px] font-medium hover:bg-primary/90 inline-flex items-center justify-center gap-2 transition-all border border-primary/70 disabled:opacity-50 disabled:cursor-not-allowed rounded-md"
                        >
                            {isPending ? "Creating..." : "Create issue"}
                            {!isPending && (
                                <ArrowRight className="size-3.5 opacity-80 group-hover:translate-x-0.5 transition-transform" strokeWidth={2} />
                            )}
                        </button>
                    </form>
                </div>

                {/* Footer strip */}
                <div className="flex items-center justify-between px-6 pb-3.5 text-[8px] font-mono tracking-[0.12em] text-muted-foreground/30 uppercase">
                    <span>devflow.app</span>
                    <span className="flex items-center gap-2">
                        <span className="size-1 rounded-full bg-status-todo" />
                        {status}
                    </span>
                    <span>Esc to close</span>
                </div>
            </div>
        </div>
    );
};

export default CreateIssueModal;