import type { Request, Response } from "express";
import { projectServices } from "./services";
import slugify from "slugify";
import { workspaceServices } from "../workspace/services";

export const projectControllers = {

    async createProjectInsideWorkspace(req: Request, res: Response) {
        try {
            const { name, description } = req.body;
            const workspaceId = req.params.workspaceId as string;
            const userId = req.user?.id;

            if (!workspaceId || !userId) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized access"
                });
            };

            const doesWorkspaceExist = await workspaceServices.getWorkspaceViaId(workspaceId);

            if (!doesWorkspaceExist) {
                return res.status(403).json({
                    success: false,
                    message: "The workspace does not exist"
                });
            };

            const doesMemberExist = await workspaceServices.getWorkspaceMemberViaId(userId, workspaceId);

            if (!doesMemberExist) {
                return res.status(403).json({
                    success: false,
                    message: "You are not a member of this workspace"
                });
            };

            const slug = slugify(name, {
                lower: true,
                strict: true
            });

            const project = await projectServices.createProject(name, description, slug, workspaceId, userId);

            return res.status(201).json({
                success: true,
                message: "created project successfully!",
                data: {
                    projectId: project?.id
                }
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        };
    },

    async getAllProjects(req: Request, res: Response) {
        try {

            const workspaceId = req.params.workspaceId as string;

            const projects = await projectServices.getAllProjects(workspaceId);

            return res.status(200).json({
                success: true,
                message: "Retreived all projects successfully!",
                data: projects
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        };
    },

    async getProject(req: Request, res: Response) {
        try {

            const projectId = req.params.projectId as string;
            const workspaceId = req.params.workspaceId as string;

            const project = await projectServices.getProject(workspaceId, projectId);

            return res.status(200).json({
                success: true,
                message: "Retreived project successfully!",
                data: project
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        };
    },

    async updateProject(req: Request, res: Response) {
        try {

            const { name, description, slug, status } = req.body;
            const projectId = req.params.projectId as string;
            const workspaceId = req.params.workspaceId as string;

            const doesProjectExist = await projectServices.getProject(workspaceId, projectId);

            if (!doesProjectExist) {
                return res.status(409).json({
                    success: false,
                    message: "Project does not exist"
                });
            };

            var regexSlug = undefined;

            if (slug) {
                regexSlug = slugify(slug, {
                    lower: true,
                    strict: true
                });
            };

            await projectServices.updateProject(workspaceId, projectId, { name, description, slug: regexSlug, status });

            return res.status(200).json({
                success: true,
                message: "Project has been updated successfully!"
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        };
    },

    async deleteProject(req: Request, res: Response) {
        try {
            const projectId = req.params.projectId as string;
            const workspaceId = req.params.workspaceId as string;

            const doesProjectExist = await projectServices.getProject(workspaceId, projectId);

            if (!doesProjectExist) {
                return res.status(409).json({
                    success: false,
                    message: "Project does not exist"
                });
            };

            return res.status(200).json({
                success: true,
                message: "Project has been deleted successfully!"
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