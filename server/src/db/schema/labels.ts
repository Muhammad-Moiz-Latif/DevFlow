import { pgTable } from 'drizzle-orm/pg-core';
import { WorkspaceTable } from './workspaces';


export const LabelsTable = pgTable('labels', (t) => ({
    id: t.uuid("id").primaryKey().defaultRandom(),
    workspace_id: t.uuid("workspaceId").references(() => WorkspaceTable.id, { onDelete: "cascade" }),
    name: t.varchar("name", { length: 255 }).notNull(),
    color: t.varchar("color", { length: 255 }).notNull(),
    createdAt: t.timestamp("createdAt").defaultNow().notNull()
}));
