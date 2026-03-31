import type { Request, Response } from 'express';
import { issueServices } from './services';
import { projectServices } from '../projects/services';

export const IssueControllers = {

    async createIssue(req: Request, res: Response) {
        try {
            const { title, description, status, priority, assignee_id, due_date } = req.body;
            const workspaceId = req.params.workspaceId as string;
            const projectId = req.params.projectId as string;
            const createdBy = req.user?.id as string;

            const doesProjectExist = await projectServices.getProject(workspaceId, projectId);

            if (!doesProjectExist) {
                return res.status(404).json({
                    success: false,
                    message: "Project not found"
                });
            };

            const parsedDueDate = due_date ? new Date(due_date) : null;

            const createdIssue = await issueServices.createIssue({
                workspace_id: workspaceId,
                project_id: projectId,
                title,
                description,
                status,
                priority,
                assignee_id,
                due_date : parsedDueDate,
                createdBy
            });

            return res.status(201).json({
                success: true,
                message: "Issue created successfully",
                data: createdIssue
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        };
    },
};