import { sql } from "drizzle-orm";
import { pgTable, uniqueIndex, index } from "drizzle-orm/pg-core";
import { WorkspaceTable } from "./workspaces";
import { UserTable } from "./users";
import { Role } from "./workspace-member";

export const WorkspaceInvitationTable = pgTable("workspace_invitations", (t) => ({
    id: t.uuid("id").primaryKey().defaultRandom(),
    workspace_id: t.uuid("workspaceId").references(() => WorkspaceTable.id, { onDelete: "cascade" }).notNull(),
    email: t.varchar("email", { length: 255 }).notNull(),
    role: Role("role").default("VIEWER").notNull(),
    token: t.varchar("token", { length: 255 }).notNull().unique(),
    invited_by: t.uuid("invitedBy").references(() => UserTable.id, { onDelete: "cascade" }).notNull(),
    expires_at: t.timestamp("expiresAt").notNull(),
    accepted_at: t.timestamp("acceptedAt"),
    created_at: t.timestamp("createdAt").defaultNow().notNull()
}), (table) => ({
    pendingInviteUnique: uniqueIndex("workspace_invitations_workspace_email_pending_unique").on(table.workspace_id, table.email).where(sql`${table.accepted_at} IS NULL`),
    workspaceIndex: index("workspace_invitations_workspace_idx").on(table.workspace_id),
    emailIndex: index("workspace_invitations_email_idx").on(table.email)
}));