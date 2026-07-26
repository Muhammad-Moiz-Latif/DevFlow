import { db, pool } from "../../config/db";
import { and, eq, isNull, sql } from "drizzle-orm";
import { WorkspaceInvitationTable } from "../../db/schema/workspace-invitations";
import { WorkspaceMembersTable } from "../../db/schema/workspace-member";
import { UserTable } from "../../db/schema/users";

export type InvitationRole = "ADMIN" | "MEMBER" | "VIEWER";

export const invitationServices = {

    async createWorkspaceInvitation(workspaceId: string, email: string, role: InvitationRole, invitedBy: string, token: string, expiresAt: Date) {
        const [invitation] = await db.insert(WorkspaceInvitationTable).values({
            workspace_id: workspaceId,
            email,
            role,
            invited_by: invitedBy,
            token,
            expires_at: expiresAt
        }).returning();

        return invitation;
    },

    async getWorkspaceInvitations(workspaceId: string) {
        const invitations = await db.execute(sql`
            SELECT
                i.id,
                i.email,
                i.role,
                i."expiresAt",
                i."acceptedAt",
                i."createdAt",
                json_build_object(
                    'id', u.id,
                    'name', u.name,
                    'email', u.email,
                    'img', u.img
                ) AS invited_by
            FROM workspace_invitations i
            JOIN users u ON i."invitedBy" = u.id
            WHERE i."workspaceId" = ${workspaceId}
            AND i."acceptedAt" IS NULL
            ORDER BY i."createdAt" DESC
        `);

        return invitations.rows;
    },

    async getWorkspaceInvitationById(workspaceId: string, invitationId: string) {
        const [invitation] = await db.select().from(WorkspaceInvitationTable).where(and(
            eq(WorkspaceInvitationTable.id, invitationId),
            eq(WorkspaceInvitationTable.workspace_id, workspaceId),
            isNull(WorkspaceInvitationTable.accepted_at)
        ));

        return invitation;
    },

    async getWorkspaceInvitationByToken(token: string) {

        const invitation = await pool.query(`
                SELECT wi.*,
                    w.name AS "workspaceName",
                    u.name as "ownerName"
                FROM workspace_invitations wi
                JOIN workspace w
                ON wi."workspaceId" = w.id
                JOIN users u
                ON w."ownerId" = u.id
                WHERE wi.token = $1
            `, [token])

        return invitation.rows[0];
    },

    async getWorkspaceInvitationByEmail(workspaceId: string, email: string) {
        const [invitation] = await db.select().from(WorkspaceInvitationTable).where(and(
            eq(WorkspaceInvitationTable.workspace_id, workspaceId),
            eq(WorkspaceInvitationTable.email, email),
            isNull(WorkspaceInvitationTable.accepted_at)
        ));

        return invitation;
    },

    async cancelWorkspaceInvitation(workspaceId: string, invitationId: string) {
        const [invitation] = await db.delete(WorkspaceInvitationTable).where(and(
            eq(WorkspaceInvitationTable.id, invitationId),
            eq(WorkspaceInvitationTable.workspace_id, workspaceId),
            isNull(WorkspaceInvitationTable.accepted_at)
        )).returning();

        return invitation;
    },

    async getUserByEmail(email: string) {
        const [user] = await db.select().from(UserTable).where(eq(UserTable.email, email)).limit(1);

        return user;
    },

    async getWorkspaceMemberByUserId(workspaceId: string, userId: string) {
        const [member] = await db.select().from(WorkspaceMembersTable).where(and(
            eq(WorkspaceMembersTable.workspace_id, workspaceId),
            eq(WorkspaceMembersTable.user_id, userId)
        ));

        return member;
    },

    async acceptWorkspaceInvitation(workspaceId: string, invitationId: string, userId: string, role: InvitationRole) {
        return db.transaction(async (tx) => {

            // Retrieve the notification
            const [invitation] = await tx.select().from(WorkspaceInvitationTable).where(and(
                eq(WorkspaceInvitationTable.id, invitationId),
                eq(WorkspaceInvitationTable.workspace_id, workspaceId),
                isNull(WorkspaceInvitationTable.accepted_at)
            ));
            console.log('the invitation,',invitation)
            if (!invitation) {
                return null;
            }

            // Retrieve the user who accepts the notification
            const [user] = await tx.select().from(UserTable).where(eq(UserTable.id, userId)).limit(1);

            if (!user || !user.email || user.email.toLowerCase() !== invitation.email.toLowerCase()) {
                throw new Error("Invitation email mismatch");
            }

            // check if invited member is made part of the workspace
            const [existingMember] = await tx.select().from(WorkspaceMembersTable).where(and(
                eq(WorkspaceMembersTable.workspace_id, workspaceId),
                eq(WorkspaceMembersTable.user_id, userId)
            ));

            // if not already a member make him one
            if (!existingMember) {
                await tx.insert(WorkspaceMembersTable).values({
                    workspace_id: workspaceId,
                    user_id: userId,
                    role,
                    status: "SUCCESS"
                });
            }

            const [acceptedInvitation] = await tx.update(WorkspaceInvitationTable).set({
                accepted_at: new Date()
            }).where(
                eq(WorkspaceInvitationTable.id, invitationId)
            ).returning();

            return {
                invitation: acceptedInvitation,
                member: existingMember ?? null
            };
        });
    }
};