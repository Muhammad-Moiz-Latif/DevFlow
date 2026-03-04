import { pgTable } from 'drizzle-orm/pg-core';
import { UserTable } from './users';
import { index } from 'drizzle-orm/pg-core';
import { IssueTable } from './issues';

export const CommentTable = pgTable("comments", (t) => ({
    id: t.uuid("id").primaryKey().defaultRandom(),
    issue_id: t.uuid("issueId").references(() => IssueTable.id, { onDelete: "cascade" }).notNull(),
    authorId: t.uuid("authorId").references(() => UserTable.id, { onDelete: "cascade" }).notNull(),
    parentId: t.uuid("parentId").references((): any => CommentTable.id, { onDelete: "cascade" }),
    text: t.text("text").notNull(),
    createdAt: t.timestamp("createdAt").defaultNow(),
    updatedAt: t.timestamp("updatedAt").defaultNow(),
}), table => ({
    commentIndex: index("comment_idx").on(table.id)
}));

