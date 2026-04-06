import { pgEnum, pgTable } from 'drizzle-orm/pg-core';
import { UserTable } from './users';
import { WorkspaceTable } from './workspaces';

export const NotificationType = pgEnum("notificationType", ['ISSUE_ASSIGNED', 'COMMENT_ON_ISSUE', 'MENTIONED', 'INVITE_ACCEPTED', 'INVITE_ISSUED', 'REMOVED']);

export const NotificationTable = pgTable('notifications', (t) => ({
    id: t.uuid("id").primaryKey().defaultRandom(),
    type: NotificationType("notification-type").default('INVITE_ACCEPTED').notNull(),
    message: t.text("message").notNull(),
    link: t.text("link").notNull(),
    is_read: t.boolean("isRead").default(false),
    user_id: t.uuid("userId").references(() => UserTable.id, { onDelete: "cascade" }),
    workspace_id: t.uuid("workspaceId").references(() => WorkspaceTable.id, { onDelete: "cascade" }),
    createdAt: t.timestamp("createdAt").defaultNow().notNull()
}));
