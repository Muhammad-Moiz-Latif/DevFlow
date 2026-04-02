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
            };

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
        };
    },


// DELETE /workspace/:workspaceId/members/:memberId                    → remove a member from workspace
// PATCH  /workspace/:workspaceId/members/:memberId/role               → change a member's role

// POST   /workspace/:workspaceId/invitations                          → send an invite email
// GET    /workspace/:workspaceId/invitations                          → list pending invitations
// DELETE /workspace/:workspaceId/invitations/:invitationId            → cancel an invitation
// POST   /workspace/invitations/accept                                → accept an invitation via token

};