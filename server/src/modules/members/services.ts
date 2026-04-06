import { db } from "../../config/db";
import { eq, and, sql } from "drizzle-orm";
import { WorkspaceMembersTable } from "../../db/schema/workspace-member";

export const memberServices = {

    async getAllWorkspaceMembers(workspaceId: string) {
        const members = await db.select().from(WorkspaceMembersTable).where(
            eq(WorkspaceMembersTable.workspace_id, workspaceId)
        );

        return members;
    },

    async getWorkspaceMember(workspaceId: string, memberId: string) {
        const member = await db.execute(sql`
            SELECT
                m.id,
                m.role,
                m.status,
                m."joinedAt",
                json_build_object (
                    'id', u.id,
                    'name', u.name,
                    'email', u.email,
                    'img', u.img
                ) AS user
            FROM workspace_members m
            JOIN users u
            ON m."userId" = u.id
            WHERE m.id = ${memberId}
            AND m."workspaceId" = ${workspaceId}
            LIMIT 1
        `);

        return member.rows[0]
    },

    async deleteWorkspaceMember(workspaceId: string, memberId: string) {
        const [member] = await db.delete(WorkspaceMembersTable).where(and(
            eq(WorkspaceMembersTable.id, memberId),
            eq(WorkspaceMembersTable.workspace_id, workspaceId)
        )).returning();

        return member;
    },

    async updateWorkspaceMember(workspaceId: string, memberId: string, role: 'MEMBER' | 'VIEWER') {
        const [updatedMember] = await db.update(WorkspaceMembersTable).set({
            role
        }).where(and(
            eq(WorkspaceMembersTable.id, memberId),
            eq(WorkspaceMembersTable.workspace_id, workspaceId)
        )).returning();

        return updatedMember;
    }
};