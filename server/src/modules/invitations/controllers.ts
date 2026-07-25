import type { Request, Response } from "express";
import crypto from "crypto";
import { workspaceServices } from "../workspace/services";
import { invitationServices, type InvitationRole } from "./services";
import { authServices } from "../auth/services";
import { sendNotification } from "../../utils/send-notification";
import { sendWorkspaceInvitationEmail } from "../../utils/send-email";
import jwt, { type JwtPayload } from 'jsonwebtoken';
import { notificationQueue } from "../../queues/notification.queue";
import "dotenv/config";

const INVITE_EXPIRY_MS = 1000 * 60 * 60 * 24 * 7;

export const invitationControllers = {

    async sendWorkspaceInvitation(req: Request, res: Response) {
        try {
            const workspaceId = req.params.workspaceId as string;
            const userId = req.user?.id;
            const { email, role } = req.body;

            if (!workspaceId || !userId) {
                return res.status(400).json({
                    success: false,
                    message: "Workspace id, user id and email are required"
                });
            };

            const workspace = await workspaceServices.getWorkspaceViaId(workspaceId);

            if (!workspace) {
                return res.status(404).json({
                    success: false,
                    message: "Workspace does not exist"
                });
            }

            const inviter = await authServices.getUserViaId(userId);

            if (!inviter) {
                return res.status(404).json({
                    success: false,
                    message: "Inviting user does not exist"
                });
            }

            const normalizedEmail = String(email).trim().toLowerCase();
            const invitedUser = await invitationServices.getUserByEmail(normalizedEmail);

            // Checking if user already is a member in the current workspace
            if (invitedUser) {
                const existingMember = await invitationServices.getWorkspaceMemberByUserId(workspaceId, invitedUser.id);

                if (existingMember) {
                    return res.status(200).json({
                        success: false,
                        message: "User is already a workspace member"
                    });
                }
            }

            // Checking if we have already sent an invitation to the current user
            const existingInvitation = await invitationServices.getWorkspaceInvitationByEmail(workspaceId, normalizedEmail);

            if (existingInvitation) {
                return res.status(209).json({
                    success: false,
                    message: "An active invitation for this email already exists"
                });
            }

            const token = crypto.randomBytes(32).toString("hex");
            const expiresAt = new Date(Date.now() + INVITE_EXPIRY_MS);

            const invitation = await invitationServices.createWorkspaceInvitation(
                workspaceId,
                normalizedEmail,
                role,
                userId,
                token,
                expiresAt
            );

            if (!invitation) {
                return res.status(500).json({
                    success: false,
                    message: "Failed to create workspace invitation"
                });
            };


            const inviteLink = `${process.env.FRONTEND_URL}/accept-invitation?token=${token}`;

            await sendWorkspaceInvitationEmail({
                inviterName: inviter.name,
                email: normalizedEmail,
                workspaceName: workspace.name,
                inviteLink,
                role
            });

            if (invitedUser) {
                await notificationQueue.add('notification', {
                    type: "INVITE_ISSUED",
                    link: `/w/${workspace.slug}`,
                    message: `You have been invited to join ${workspace.name}`,
                    user_id: invitedUser.id,
                    workspace_id: workspaceId
                });
            }

            return res.status(201).json({
                success: true,
                message: "Workspace invitation sent successfully",
                data: {
                    id: invitation.id,
                    workspace_id: invitation.workspace_id,
                    email: invitation.email,
                    role: invitation.role,
                    invited_by: invitation.invited_by,
                    expires_at: invitation.expires_at,
                    accepted_at: invitation.accepted_at,
                    created_at: invitation.created_at
                }
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    },

    async getWorkspaceInvitation(req: Request, res: Response) {
        try {
            const token = req.query.token as string;
            const accessToken = req.query.accessToken as string | undefined;
            var userStatus = 'NO_ACCOUNT';
            var currentEmail;
            var InvitedUserExists = false;
            const getPayload: any = accessToken ? jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET!) : null;

            const invitation = await invitationServices.getWorkspaceInvitationByToken(token);

            // check if user is logged in with a different email to the one we have sent invitation on
            if (getPayload) {
                const isSameUser = await authServices.getUserViaId(getPayload.id);
                currentEmail = isSameUser?.email || undefined
                if (isSameUser?.email != invitation.email) {
                    userStatus = 'DIFFERENT_ACCOUNT'
                }
            };

            if (!invitation) {
                return res.status(400).json({
                    success: false,
                    message: 'Unauthorized access'
                })
            };

            // Check if the invited member has an account
            const doesInvitedMemberHaveAnAccount = await authServices.getUserViaEmail(invitation.email);

            if (doesInvitedMemberHaveAnAccount && userStatus != 'DIFFERENT_ACCOUNT') {
                userStatus = 'SAME_ACCOUNT'
                InvitedUserExists = true;
            };

            return res.status(200).json({
                success: true,
                message: "Retrieved workspace invitations successfully",
                data: {
                    ...invitation,
                    userStatus,
                    InvitedUserExists,
                    currentEmail
                }
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    },

    async getWorkspaceInvitations(req: Request, res: Response) {
        try {
            const workspaceId = req.params.workspaceId as string;

            if (!workspaceId) {
                return res.status(400).json({
                    success: false,
                    message: "Workspace id is required"
                });
            }

            const invitations = await invitationServices.getWorkspaceInvitations(workspaceId);

            return res.status(200).json({
                success: true,
                message: "Retrieved workspace invitations successfully",
                data: invitations
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    },

    async cancelWorkspaceInvitation(req: Request, res: Response) {
        try {
            const workspaceId = req.params.workspaceId as string;
            const invitationId = req.params.invitationId as string;

            if (!workspaceId || !invitationId) {
                return res.status(400).json({
                    success: false,
                    message: "Workspace id and invitation id are required"
                });
            }

            const invitation = await invitationServices.getWorkspaceInvitationById(workspaceId, invitationId);

            if (!invitation) {
                return res.status(404).json({
                    success: false,
                    message: "Invitation does not exist"
                });
            }

            await invitationServices.cancelWorkspaceInvitation(workspaceId, invitationId);

            return res.status(200).json({
                success: true,
                message: "Workspace invitation cancelled successfully"
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    },

    async acceptWorkspaceInvitation(req: Request, res: Response) {
        try {
            const userId = req.user?.id;
            const { token } = req.body;

            if (!userId || !token) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized access"
                });
            };

            const invitation = await invitationServices.getWorkspaceInvitationByToken(token);


            if (!invitation) {
                return res.status(404).json({
                    success: false,
                    message: "Invitation does not exist"
                });
            }

            if (new Date() > new Date(invitation.expires_at)) {
                return res.status(400).json({
                    success: false,
                    message: "Invitation has expired"
                });
            }

            if (invitation.accepted_at) {
                // 208 = Already reported
                return res.status(208).json({
                    success: true,
                    message: "Invitation has been accepted already"
                })
            }

            const acceptedInvitation = await invitationServices.acceptWorkspaceInvitation(
                invitation.workspace_id,
                invitation.id,
                userId,
                invitation.role
            );

            if (!acceptedInvitation) {
                return res.status(400).json({
                    success: false,
                    message: "Invitation is no longer pending"
                });
            }

            const inviter = await authServices.getUserViaId(invitation.invited_by);

            if (inviter) {
                await sendNotification({
                    type: "INVITE_ACCEPTED",
                    link: `/workspace/${invitation.workspace_id}`,
                    message: `Your invitation to ${invitation.email} has been accepted`,
                    user_id: inviter.id,
                    workspace_id: invitation.workspace_id
                });
            }

            return res.status(200).json({
                success: true,
                message: "Invitation accepted successfully",
                data: acceptedInvitation
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