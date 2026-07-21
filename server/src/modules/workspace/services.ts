import { eq, and, sql } from "drizzle-orm";
import { db, pool } from "../../config/db";
import { WorkspaceTable } from "../../db/schema/workspaces";
import { WorkspaceMembersTable } from "../../db/schema/workspace-member";
import { ProjectTable } from "../../db/schema/projects";
import { IssueTable } from "../../db/schema/issues";


export const workspaceServices = {

    async createWorkSpaceAndAdminMember(name: string, slug: string, image: string | null, ownerId: string) {
        const workspace = await db.transaction(async (tx) => {
            const [newWorkspace] = await tx.insert(WorkspaceTable).values({
                name,
                slug,
                img: image,
                owner_id: ownerId
            }).returning();

            await tx.insert(WorkspaceMembersTable).values({
                workspace_id: newWorkspace?.id,
                user_id: ownerId,
                role: 'ADMIN',
                status: "SUCCESS"
            });

            return newWorkspace;
        });

        return workspace;
    },

    async getWorkspaceViaName(name: string) {
        const [workspace] = await db.select().from(WorkspaceTable).where(
            eq(WorkspaceTable.name, name)
        ).limit(1);

        return workspace;
    },

    async getWorkspaceViaId(id: string) {
        const [workspace] = await db.select().from(WorkspaceTable).where(
            eq(WorkspaceTable.id, id)
        );

        return workspace;
    },

    async getWorkspaceViaSlug(slug: string) {
        const [workspace] = await db.select().from(WorkspaceTable).where(
            eq(WorkspaceTable.slug, slug)
        );

        return workspace;
    },

    async updateWorkspace(workspaceId: string, data: Partial<typeof WorkspaceTable.$inferInsert>) {

        const updateData: typeof data = {};

        if (data.name !== undefined) updateData.name = data.name;
        if (data.slug !== undefined) updateData.slug = data.slug;
        if (data.img !== undefined && data.img != null) updateData.img = data.img;

        if (Object.keys(updateData).length === 0) {
            throw new Error("No fields provided to update");
        }

        const [updated] = await db
            .update(WorkspaceTable)
            .set(updateData)
            .where(eq(WorkspaceTable.id, workspaceId))
            .returning();

        return updated;
    },

    async deleteWorkspace(workspaceId: string, ownerId: string) {
        const [deleted] = await db.delete(WorkspaceTable).where(and(
            eq(WorkspaceTable.id, workspaceId),
            eq(WorkspaceTable.owner_id, ownerId)
        )).returning();

        return deleted;
    },

    async getWorkspaceMemberViaId(userId: string, workspaceId: string) {
        const [member] = await db.select().from(WorkspaceMembersTable).where(and(
            eq(WorkspaceMembersTable.user_id, userId),
            eq(WorkspaceMembersTable.workspace_id, workspaceId)
        ));

        return member;
    },

    async getMyIssuesFromWorkspace(userId: string, workspaceId: string) {
        const myissues = await db.select().from(IssueTable).where(and(
            eq(IssueTable.workspace_id, workspaceId),
            eq(IssueTable.assignee_id, userId)
        ));

        return myissues;
    },

    async getAllActivityLogsOfWorkspace(workspaceId: string) {
        const activityLogs = await db.execute(sql`
            SELECT
                al.id,
                al."issueId",
                al."workspaceId",
                al."logType",
                al."oldValue",
                al."newValue",
                al."createdAt",
                json_build_object (
                    'id', u.id,
                    'username', u.name,
                    'email', u.email,
                    'img', u.img
                ) AS actor
            FROM "activity-logs" al
            JOIN users u
            ON al."actorId" = u.id
            WHERE al."workspaceId" = ${workspaceId}
        `);

        return activityLogs.rows;
    },

    async getAllUserWorkspaces(userId: string) {
        const workspaces = await db.execute(sql`
            SELECT
                wm."role" ,
                json_build_object (
                    'name', w.name,
                    'slug', w.slug
                ) AS Workspace

            FROM "workspace_members" wm 
            JOIN workspace w 
            ON wm."workspaceId" = w.id
            WHERE wm."userId" = ${userId}
        `);

        return workspaces.rows;
    },

    async getMyNotifications(userId: string, workspaceId: string) {
        const result = await pool.query(`
            SELECT *
            FROM notifications
            WHERE "userId" = $1
            AND "workspaceId" = $2
            `, [userId, workspaceId]);

        return result.rows;
    },

    async getMyNotification(userId: string, notificationId: string) {
        const result = await pool.query(`
            SELECT *
            FROM notifications
            WHERE "userId" = $1
            AND "id" = $2
            `, [userId, notificationId]);

        return result.rows[0];
    },

    async updateMyNotification(userId: string, notificationId: string) {
        const result = await pool.query(`
            UPDATE notifications
            SET "isRead" = $1
            WHERE "userId" = $2
            AND id = $3
            `, [true, userId, notificationId]);
        return result.rows[0];
    },




};