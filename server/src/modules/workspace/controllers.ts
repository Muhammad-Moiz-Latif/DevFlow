import uploadImage from "../../utils/upload-image";
import slugify from 'slugify';
import { workspaceServices } from "./services";
import type { Response, Request } from 'express';

export const workspaceControllers = {

    async createWorkspace(req: Request, res: Response) {
        try {
            const { name } = req.body;
            const id = req.user?.id;

            if (!name || !id) {
                return res.status(409).json({
                    success: false,
                    message: "Name or userId is missing"
                });
            };

            const doesNamealreadyExist = await workspaceServices.getWorkspaceViaName(name);


            if (doesNamealreadyExist) {
                return res.status(400).json({
                    success: false,
                    message: "Workspace name has already been taken, please try again"
                });
            };

            const slug = slugify(name, {
                lower: true,
                strict: true
            });


            const image = req.file;

            let imgURL: string | null = null;

            if (image) {
                imgURL = await uploadImage(image.buffer);
            };

            const createdWorkspace = await workspaceServices.createWorkSpaceAndAdminMember(name, slug, imgURL, id!);

            if (!createdWorkspace) {
                return res.status(400).json({
                    success: false,
                    message: "Unable to create workspace"
                });
            };

            return res.status(201).json({
                success: true,
                message: "Workspace created successfully"
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        };
    },

    async getWorkspace(req: Request, res: Response) {
        try {
            const workspaceId = req.params.workspaceId as string;
            const userId = req.user?.id;

            if (!workspaceId || !userId) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized access"
                });
            };

            const workspace = await workspaceServices.getWorkspaceViaId(workspaceId);

            return res.status(200).json({
                success: true,
                message: "Retrieved workspace successfully!",
                data: workspace
            });

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        };
    },

    async getAllWorkspaceMembers(req: Request, res: Response) {
        try {
            const workspaceId = req.params.workspaceId as string;
            const userId = req.user?.id;

            if (!workspaceId || !userId) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized access"
                });
            };

            const workspaceMembers = await workspaceServices.getAllWorkspaceMembers(workspaceId);

            return res.status(200).json({
                success: true,
                message: "Retrieved all of the workspace members successfully!",
                data: workspaceMembers
            });

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        };
    },

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

            const project = await workspaceServices.createProject(name, description, slug, workspaceId, userId);

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
};