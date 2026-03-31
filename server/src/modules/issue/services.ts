import { db } from "../../config/db";
import { eq, and, count } from "drizzle-orm";
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
};