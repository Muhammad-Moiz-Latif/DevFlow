import { useState } from "react";
import { X } from "lucide-react";
import type { createIssueType } from "../../issue/apis/createissue";
import { useParams } from "react-router";
import { useCurrentWorkspace } from "../../workspace/query/useCurrentWorkspace";
import { useWorkspaceMembers } from "../../members/query/useWorkspaceMembers";
import { useAuthStore } from "../../../stores/auth-store";
import { useCurrentProject } from "../query/useCurrentProject";

type CreateIssueModalProps = {
    workspaceId: string;
    projectId: string;
    status: 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE';
    onClose: () => void;
    onSubmit?: (data: createIssueType) => void;
};

const CreateIssueModal = ({
    workspaceId,
    projectId,
    status,
    onClose,
    onSubmit,
}: CreateIssueModalProps) => {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        priority: "MEDIUM" as const,
        assignee_id: "",
        due_date: "",
    });

    const { workspaceSlug, projectSlug } = useParams();
    const { user } = useAuthStore();
    const { data: workspaceData } = useCurrentWorkspace(workspaceSlug!);
    const { data: projectData } = useCurrentProject(projectSlug!, workspaceData?.data?.id!);
    const { data: workspaceMembers } = useWorkspaceMembers(workspaceData?.data?.id!);


    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title.trim()) {
            alert("Title is required");
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
        console.log(payload);
        onSubmit?.(payload);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative z-50 w-full max-w-md mx-4 bg-background border border-border/50 rounded-lg shadow-lg max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-border/30">
                    <h2 className="text-lg font-semibold text-foreground">Create New Issue</h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-accent/10 rounded-md transition-colors"
                    >
                        <X className="w-5 h-5 text-muted-foreground" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-4 space-y-3">
                    {/* Title Field */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">
                            Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Issue title"
                            className="w-full px-3 py-2 bg-background border border-border/50 rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
                        />
                    </div>

                    {/* Description Field */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Issue description (optional)"
                            rows={2}
                            className="w-full px-3 py-2 bg-background border border-border/50 rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 resize-none"
                        />
                    </div>

                    {/* Grid for Priority and Due Date */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* Priority Field */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">
                                Priority
                            </label>
                            <select
                                name="priority"
                                value={formData.priority}
                                onChange={handleChange}
                                className="w-full px-3 py-2 bg-background border border-border/50 rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
                            >
                                <option value="LOW">Low</option>
                                <option value="MEDIUM">Medium</option>
                                <option value="HIGH">High</option>
                                <option value="URGENT">Urgent</option>
                            </select>
                        </div>

                        {/* Due Date Field */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">
                                Due Date
                            </label>
                            <input
                                type="date"
                                name="due_date"
                                value={formData.due_date}
                                onChange={handleChange}
                                className="w-full px-3 py-2 bg-background border border-border/50 rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
                            />
                        </div>
                    </div>

                    {/* Assignee Field */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">
                            Assignee (optional)
                        </label>
                        <input
                            type="text"
                            name="assignee_id"
                            value={formData.assignee_id}
                            onChange={handleChange}
                            placeholder="Assignee ID"
                            className="w-full px-3 py-2 bg-background border border-border/50 rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
                        />
                        <p className="text-xs text-muted-foreground">
                            You can improve this by fetching team members
                        </p>
                    </div>

                    {/* Status Display */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">
                            Status
                        </label>
                        <div className="px-3 py-2 bg-accent/5 border border-border/30 rounded-md text-foreground text-sm">
                            {status}
                        </div>
                    </div>
                </form>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 p-4 border-t border-border/30">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-foreground bg-background border border-border/50 rounded-md hover:bg-accent/5 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 text-sm font-medium text-background bg-accent rounded-md hover:bg-accent/90 transition-colors"
                    >
                        Create Issue
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateIssueModal;
