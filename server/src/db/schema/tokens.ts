import { pgTable, pgEnum } from 'drizzle-orm/pg-core';
import { UserTable } from './users';


export const verificationTokenType = pgEnum("tokenType", ["EMAIL_VERIFICATION", "PASSWORD_RESET"]);

export const verificationTokenTable = pgTable("verify_token", (t) => ({
    id: t.uuid("id").primaryKey().defaultRandom(),
    user_id: t.uuid("userId").references(() => UserTable.id, { onDelete: "cascade" }).notNull(),
    token: t.varchar('token', { length: 255 }).notNull().unique(),
    type: verificationTokenType("token-type").default("EMAIL_VERIFICATION").notNull(),
    expiresAt: t.timestamp("expiresAt").defaultNow(),
    createdAt: t.timestamp("createdAt").defaultNow()
}));