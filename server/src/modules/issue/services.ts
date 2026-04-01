import { db } from "../../config/db";
import { eq, and, count, sql } from "drizzle-orm";
import { IssueTable } from "../../db/schema/issues";

type CreateIssue = Omit<typeof IssueTable.$inferInsert, 'id' | 'created_at' | 'updated_at' | 'order'>;

export const issueServices = {

    async createIssue(data: CreateIssue) {

        const existingIssuesCount = await db
            .select({ count: count() })
            .from(IssueTable)
            .where(
                and(
                    eq(IssueTable.project_id, data.project_id!),
                    eq(IssueTable.status, data.status!)
                )
            );

        const order = (existingIssuesCount[0]?.count!) + 1;

        const [issue] = await db
            .insert(IssueTable)
            .values({ ...data, order })
            .returning();

        return issue;
    },

    async getAllIssues(workspaceId: string, projectId: string) {
        const issues = await db.execute(sql`
            SELECT
                i.id,
                i.title,
                i.description,
                i.status,
                i.priority,
                i.order,
                i."dueDate",
                i."createdAt",
                i."updatedAt",
                CASE
                    WHEN u.id IS NOT NULL THEN
                        json_build_object(
                        'id',u.id,
                        'name',u.name,
                        'email',u.email,
                        'img',u.img
                        )
                    ELSE NULL
                END AS assignee,
                json_build_object(
                    'id',ou.id,
                    'name',ou.name,
                    'email',ou.email,
                    'img',ou.img
                ) AS creator

                FROM issues i
                LEFT JOIN users u ON i."assigneeId" = u.id
                JOIN users ou ON i."createdBy" = ou.id
                WHERE i."workspaceId" = ${workspaceId}
                AND i."projectId" = ${projectId}
        `);

        return issues.rows;
    },

    async getIssue(workspaceId: string, projectId: string, issueId: string) {
        const issue = await db.execute(sql`
            SELECT
                i.id,
                i.title,
                i.description,
                i.status,
                i.priority,
                i.order,
                i."dueDate",
                i."createdAt",
                i."updatedAt",
                CASE
                    WHEN u.id IS NOT NULL THEN
                        json_build_object(
                        'id',u.id,
                        'name',u.name,
                        'email',u.email,
                        'img',u.img
                        )
                    ELSE NULL
                END AS assignee,
                json_build_object(
                    'id',ou.id,
                    'name',ou.name,
                    'email',ou.email,
                    'img',ou.img
                ) AS creator

                FROM issues i
                LEFT JOIN users u ON i."assigneeId" = u.id
                JOIN users ou ON i."createdBy" = ou.id
                WHERE i."workspaceId" = ${workspaceId}
                AND i."projectId" = ${projectId}
                AND i.id = ${issueId}
        `);

        return issue.rows[0];
    },

    async updateIssue(workspaceId: string, projectId: string, issueId: string, data: Partial<typeof IssueTable.$inferInsert>) {

        const updateData = Object.fromEntries(
            Object.entries(data).filter((_, value) => value !== undefined)
        ) as typeof data;

        const [issue] = await db.update(IssueTable).set(updateData).where(and(
            eq(IssueTable.id, issueId),
            eq(IssueTable.workspace_id, workspaceId),
            eq(IssueTable.project_id, projectId)
        )).returning();

        return issue;
    },

    async deleteIssue(workspaceId: string, projectId: string, issueId: string) {
        const [issue] = await db.delete(IssueTable).where(and(
            eq(IssueTable.id, issueId),
            eq(IssueTable.workspace_id, workspaceId),
            eq(IssueTable.project_id, projectId)
        )).returning();

        return issue;
    },

    async getMyIssues(workspaceId: string, userId: string) {
        const issues = await db.execute(sql`
            SELECT
                i.id,
                i.title,
                i.description,
                i.status,
                i.priority,
                i.order,
                i."dueDate",
                i."createdAt",
                i."updatedAt",
                json_build_object (
                    'name', p.name,
                    'id', p.id
                ) AS "project"

            FROM issues i
            JOIN projects p ON i."projectId" = p.id
            WHERE i."assigneeId" = ${userId}
            AND i."workspaceId" = ${workspaceId}
            ORDER BY i."createdAt" ASC
        `);

        return issues.rows;
    },
};