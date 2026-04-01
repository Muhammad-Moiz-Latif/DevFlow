import type { Request, Response } from 'express';
import { issueServices } from './services';
import { projectServices } from '../projects/services';
import { workspaceServices } from '../workspace/services';
import { sendNotification } from '../../utils/send-notification';

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

            if (assignee_id) {
                await sendNotification({
                    type: "ISSUE_ASSIGNED",
                    user_id: assignee_id,
                    link: "some link",
                    message: "get to work son",
                    workspace_id: workspaceId
                });
            };

            const createdIssue = await issueServices.createIssue({
                workspace_id: workspaceId,
                project_id: projectId,
                title,
                description,
                status,
                priority,
                assignee_id,
                dueDate: parsedDueDate,
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

    async getAllIssues(req: Request, res: Response) {
        try {
            const projectId = req.params.projectId as string;
            const workspaceId = req.params.workspaceId as string;

            const doesProjectExist = await projectServices.getProject(workspaceId, projectId);

            if (!doesProjectExist) {
                return res.status(404).json({
                    success: false,
                    message: "Project does not exist"
                });
            };

            const issues = await issueServices.getAllIssues(workspaceId, projectId);

            return res.status(200).json({
                success: true,
                message: "Returned all issues successfully",
                data: issues
            });


        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        };
    },

    async getIssue(req: Request, res: Response) {
        try {
            const projectId = req.params.projectId as string;
            const workspaceId = req.params.workspaceId as string;
            const issueId = req.params.issueId as string;

            const doesProjectExist = await projectServices.getProject(workspaceId, projectId);

            if (!doesProjectExist) {
                return res.status(404).json({
                    success: false,
                    message: "Project does not exist"
                });
            };

            const issue = await issueServices.getIssue(workspaceId, projectId, issueId);

            return res.status(200).json({
                success: true,
                message: "Returned issue successfully",
                data: issue
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        };
    },

    async updateIssue(req: Request, res: Response) {
        try {
            const { title, description, status, priority, order, assignee_id, dueDate } = req.body;
            const projectId = req.params.projectId as string;
            const workspaceId = req.params.workspaceId as string;
            const issueId = req.params.issueId as string;

            const doesProjectExist = await projectServices.getProject(workspaceId, projectId);

            if (!doesProjectExist) {
                return res.status(404).json({
                    success: false,
                    message: "Project does not exist"
                });
            };

            const doesIssueExist = await issueServices.getIssue(workspaceId, projectId, issueId);

            if (!doesIssueExist) {
                return res.status(404).json({
                    success: false,
                    message: "Issue does not exist"
                });
            };

            const issue = await issueServices.updateIssue(workspaceId, projectId, issueId, { title, description, status, priority, order, assignee_id, dueDate });

            if (assignee_id) {
                await sendNotification({
                    type: "ISSUE_ASSIGNED",
                    user_id: assignee_id,
                    link: "some link",
                    message: "get to work son",
                    workspace_id: workspaceId
                });
            };
            
            return res.status(200).json({
                success: true,
                message: "Issue updated successfully",
                data: issue
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        };
    },

    async deleteIssue(req: Request, res: Response) {
        try {
            const projectId = req.params.projectId as string;
            const workspaceId = req.params.workspaceId as string;
            const issueId = req.params.issueId as string;

            const doesProjectExist = await projectServices.getProject(workspaceId, projectId);

            if (!doesProjectExist) {
                return res.status(404).json({
                    success: false,
                    message: "Project does not exist"
                });
            };

            const doesIssueExist = await issueServices.getIssue(workspaceId, projectId, issueId);

            if (!doesIssueExist) {
                return res.status(404).json({
                    success: false,
                    message: "Issue does not exist"
                });
            };

            await issueServices.deleteIssue(workspaceId, projectId, issueId);

            return res.status(200).json({
                success: true,
                message: "Issue deleted successfully",
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        };
    },

    async myIssues(req: Request, res: Response) {
        try {
            const userId = req.user?.id!;
            const workspaceId = req.params.workspaceId as string;

            const doesWorkspaceExist = await workspaceServices.getWorkspaceViaId(workspaceId);

            if (!doesWorkspaceExist) {
                return res.status(404).json({
                    success: false,
                    message: "Workspace does not exist"
                });
            };

            const myIssues = await issueServices.getMyIssues(workspaceId, userId);

            return res.status(200).json({
                success: true,
                message: "Retreived issues successfully!",
                data: myIssues
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