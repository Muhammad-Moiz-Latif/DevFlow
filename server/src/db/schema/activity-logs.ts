import { pgEnum, pgTable } from 'drizzle-orm/pg-core';
import { IssueTable } from './issues';
import { WorkspaceTable } from './workspaces';
import { UserTable } from './users';

export const LogType = pgEnum("logType", ['STATUS_CHANGED', 'PRIORITY_CHANGED', 'ASSIGNEE_CHANGED', 'COMMENT_ADDED', 'COMMENT_DELETED', 'ISSUE_CREATED']);

export const ActivityLogsTable = pgTable("activity-logs", (t) => ({
    id: t.uuid("id").primaryKey().defaultRandom(),
    issue_id: t.uuid("issueId").references(() => IssueTable.id).notNull(),
    workspace_id: t.uuid("workspaceId").references(() => WorkspaceTable.id, { onDelete: "cascade" }).notNull(),
    actor_id: t.uuid("actorId").references(() => UserTable.id).notNull(),
    type: LogType("logType").default("ISSUE_CREATED").notNull(),
    old_value: t.text("oldValue").notNull(),
    new_value: t.text("newValue").notNull(),
    createdAt: t.timestamp("createdAt").defaultNow().notNull()
}));