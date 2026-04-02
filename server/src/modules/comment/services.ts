import { db } from "../../config/db";
import { eq, and, sql } from "drizzle-orm";
import { CommentTable } from "../../db/schema/comments";

export const commentServices = {

    async createComment(issueId: string, userId: string, text: string, parentId?: string) {

        const [comment] = await db.insert(CommentTable).values({
            issue_id: issueId,
            authorId: userId,
            text,
            parentId: parentId ?? null
        }).returning();

        return comment;
    },

    async getCommentViaId(commentId: string) {
        const [comment] = await db.select().from(CommentTable).where(
            eq(CommentTable.id, commentId)
        );

        return comment;
    },

    async getAllComments(issueId: string) {
        const comments = await db.execute(sql`
            SELECT 
                c.id,
                c.text,
                c."issueId",
                c."createdAt",
                c."updatedAt",
                json_build_object(
                    'id', u.id,
                    'name', u.name,
                    'email', u.email,
                    'img', u.img
                ) AS author,
                COALESCE (
                    (
                        SELECT
                            json_agg(
                                json_build_object(
                                    'id', r.id,
                                    'text', r.text,
                                    'createdAt', r."createdAt",
                                    'updatedAt', r."updatedAt",
                                    'author', json_build_object(
                                        'id', ru.id,
                                        'name', ru.name,
                                        'email', ru.email,
                                        'img', ru.img
                                    )
                                )
                                ORDER BY r."createdAt" ASC
                            )
                        FROM comments r 
                        JOIN users ru
                        ON r."authorId" = ru.id
                        WHERE r."parentId" = c.id
                    ), '[]' :: json
                ) AS replies
                FROM comments c
                JOIN users u
                ON c."authorId" = u.id
                WHERE c."issueId" = ${issueId}
                AND c."parentId" IS NULL
                ORDER BY c."createdAt" ASC
        `);

        return comments.rows;
    },

    async updateComment(commentId: string, text: string, authorId: string) {
        const [updatedComment] = await db.update(CommentTable).set({
            text,
            updatedAt: new Date()
        }).where(and(
            eq(CommentTable.id, commentId),
            eq(CommentTable.authorId, authorId)
        )).returning();

        return updatedComment;
    },

    async deleteComment(commentId: string) {
        const [comment] = await db.delete(CommentTable).where(
            eq(CommentTable.id, commentId)
        ).returning();

        return comment;
    }
};