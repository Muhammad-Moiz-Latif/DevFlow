import { pgTable, primaryKey } from 'drizzle-orm/pg-core';
import { IssueTable } from './issues';
import { LabelsTable } from './labels';


export const IssueLabelsTable = pgTable('issue-labels', (t) => ({
    issue_id: t.uuid("issueId").references(() => IssueTable.id, { onDelete: "cascade" }),
    label_id: t.uuid("labelId").references(() => LabelsTable.id, { onDelete: "cascade" }),
    createdAt: t.timestamp("createdAt").defaultNow().notNull()
}), table => ({
    pk: primaryKey({ name: "ID", columns: [table.issue_id, table.label_id] })
}));
