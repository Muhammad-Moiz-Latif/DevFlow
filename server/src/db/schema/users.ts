import { pgTable, pgEnum, index } from 'drizzle-orm/pg-core';

export const AuthType = pgEnum("AuthType", ["CREDENTIALS", "GOOGLE", "BOTH"]);
export const AccountStatus = pgEnum("accountStatus", ["DENIED", "PENDING", "SUCCESS"]);

export const UserTable = pgTable("users", (t) => ({
    id: t.uuid("id").primaryKey().defaultRandom(),
    name: t.varchar("name", { length: 255 }).notNull(),
    authType: AuthType("authType").default('CREDENTIALS').notNull(),
    status: AccountStatus("status").default("PENDING").notNull(),
    email: t.varchar("email", { length: 255 }),
    password: t.varchar("password", { length: 255 }),
    img: t.varchar("img").default(""),
    createdAt: t.timestamp("createdAt").defaultNow().notNull()
}), table => ({
    emailIndex: index("emailIdx").on(table.email),
    nameIndex: index("nameIdx").on(table.name)
})); 