import { sendNotification } from "../../utils/send-notification";
import { workspaceServices } from "../workspace/services";
import { memberServices } from "./services";
import type { Request, Response } from "express";

export const memberControllers = {
    
    async getAllWorkspaceMembers(req: Request, res: Response) {
        try {
            const workspaceId = req.params.workspaceId as string;
            const userId = req.user?.id;

            if (!workspaceId || !userId) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized access"
                });
            }

            const workspaceMembers = await memberServices.getAllWorkspaceMembers(workspaceId);

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
        }
    },

    async deleteWorkspaceMember(req: Request, res: Response) {
        try {
            const memberId = req.params.memberId as string;
            const workspaceId = req.params.workspaceId as string;

            const doesWorkspaceExist = await workspaceServices.getWorkspaceViaId(workspaceId);

            if (!doesWorkspaceExist) {
                return res.status(404).json({
                    success: false,
                    message: "Workspace does not exist"
                });
            }

            const doesWorkspaceMemberExist = await memberServices.getWorkspaceMember(workspaceId, memberId);

            if (!doesWorkspaceMemberExist) {
                return res.status(404).json({
                    success: false,
                    message: "Member does not exist"
                });
            }

            await memberServices.deleteWorkspaceMember(workspaceId, memberId);

            await sendNotification({
                type: "REMOVED",
                link: "some link",
                message: "You have been removed from workspace by Admin",
                user_id: memberId,
                workspace_id: workspaceId
            });

            return res.status(200).json({
                success: true,
                message: "Member removed successfully"
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    },

    async updateWorkspaceMember(req: Request, res: Response) {
        try {
            const { role } = req.body;
            const memberId = req.params.memberId as string;
            const workspaceId = req.params.workspaceId as string;

            const doesWorkspaceExist = await workspaceServices.getWorkspaceViaId(workspaceId);

            if (!doesWorkspaceExist) {
                return res.status(404).json({
                    success: false,
                    message: "Workspace does not exist"
                });
            }

            const doesWorkspaceMemberExist = await memberServices.getWorkspaceMember(workspaceId, memberId);

            if (!doesWorkspaceMemberExist) {
                return res.status(404).json({
                    success: false,
                    message: "Member does not exist"
                });
            }

            await memberServices.updateWorkspaceMember(workspaceId, memberId, role);

            return res.status(200).json({
                success: true,
                message: `Member's role changed to ${role} successfully!`
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    }
};