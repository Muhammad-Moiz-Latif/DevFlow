import { pgTable, index } from 'drizzle-orm/pg-core';
import { UserTable } from './users';


export const WorkspaceTable = pgTable("workspace", (t) => ({
    id: t.uuid("id").primaryKey().defaultRandom(),
    name: t.varchar("name", { length: 255 }).notNull(),
    slug: t.varchar("slug", { length: 255 }),
    img: t.varchar("img").default(""),
    owner_id: t.uuid("ownerId").references(() => UserTable.id),
    createdAt: t.timestamp("createdAt").defaultNow().notNull()
}), table => ({
    WorkspaceIndex: index("WorkspaceIdx").on(table.name)
})); 