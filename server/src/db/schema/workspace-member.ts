import { pgTable, pgEnum } from 'drizzle-orm/pg-core';
import { UserTable, AccountStatus } from './users';
import { WorkspaceTable } from './workspaces';

export const Role = pgEnum("Role", ["ADMIN", "MEMBER", "VIEWER"]);

export const WorkspaceMembersTable = pgTable("workspace_members", (t) => ({
    id: t.uuid("id").primaryKey().defaultRandom(),
    user_id: t.uuid("userId").references(() => UserTable.id),
    workspace_id: t.uuid("workspaceId").references(() => WorkspaceTable.id, { onDelete: "cascade" }),
    role: Role("role").default('VIEWER').notNull(),
    status: AccountStatus("status").default("PENDING").notNull(),
    createdAt: t.timestamp("createdAt").defaultNow().notNull(),
    joinedAt: t.timestamp("joinedAt").defaultNow().notNull()
})); 