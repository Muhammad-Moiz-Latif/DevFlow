import { pgTable, pgEnum } from 'drizzle-orm/pg-core';
import { ProjectTable } from './projects';
import { WorkspaceTable } from './workspaces';
import { UserTable } from './users';

export const IssueStatus = pgEnum("issueStatus", ['TODO', 'IN_PROGRESS', "IN_REVIEW", "DONE"]);
export const Priority = pgEnum("priority", ["URGENT", "HIGH", "MEDIUM", "LOW"]);

export const IssueTable = pgTable("issues", (t) => ({
    id: t.uuid("id").primaryKey().defaultRandom(),
    project_id: t.uuid("projectId").references(() => ProjectTable.id),
    workspace_id: t.uuid("workspaceId").references(() => WorkspaceTable.id),
    title: t.varchar("title", { length: 255 }).notNull(),
    description: t.text("description").notNull(),
    status: IssueStatus("status").default('TODO'),
    priority: Priority("priority").default("LOW"),
    assignee_id: t.uuid("assigneeId").references(() => UserTable.id),
    createdBy: t.uuid("createdBy").references(() => UserTable.id),
    order: t.integer("order").default(0),
    due_date: t.timestamp("dueData").defaultNow(),
    createdAt: t.timestamp("createdAt").defaultNow(),
    updatedAt: t.timestamp("updatedAt").defaultNow(),
}));