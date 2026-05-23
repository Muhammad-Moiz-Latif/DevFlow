import type { Request, Response, NextFunction } from "express";
import { workspaceServices } from "../modules/workspace/services";

type WorkspaceRole = 'ADMIN' | 'MEMBER' | 'VIEWER';

export const allowedRoles = (roles: WorkspaceRole[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const workspaceId = req.params.workspaceId as string;
            const userId = req.user?.id;

            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized access"
                });
            }

            const member = await workspaceServices.getWorkspaceMemberViaId(userId, workspaceId);

            if (!member) {
                return res.status(403).json({
                    success: false,
                    message: "You are not a member of this workspace"
                });
            }

            if (!roles.includes(member.role)) {
                return res.status(403).json({
                    success: false,
                    message: "You do not have permission to perform this action"
                });
            }

            next();

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    }
}