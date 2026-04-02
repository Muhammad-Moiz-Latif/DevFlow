import { db } from "../../config/db";
import { eq } from "drizzle-orm";
import { WorkspaceMembersTable } from "../../db/schema/workspace-member";

export const memberServices = {
    
    async getAllWorkspaceMembers(workspaceId: string) {
        const members = await db.select().from(WorkspaceMembersTable).where(
            eq(WorkspaceMembersTable.workspace_id, workspaceId)
        );

        return members;
    },
};