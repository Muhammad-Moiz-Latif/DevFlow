import { pgEnum, pgTable } from "drizzle-orm/pg-core"
import { WorkspaceTable } from "./workspaces"
import { UserTable } from "./users";

export const projectStatus = pgEnum("projectStatus", ["Archived", "Active"]);

export const ProjectTable = pgTable('projects', (t) => ({
    id: t.uuid("id").primaryKey().defaultRandom(),
    workspace_id: t.uuid("workspaceId").references(() => WorkspaceTable.id, { onDelete: "cascade" }),
    name: t.varchar("name", { length: 255 }).notNull(),
    description: t.text("description").notNull(),
    slug: t.varchar("slug"),
    status: projectStatus("status").default("Active").notNull(),
    created_by: t.uuid("createdBy").references(() => UserTable.id),
    created_at: t.timestamp("createdAt").defaultNow().notNull(),
    updated_at: t.timestamp("updatedAt")
}));
