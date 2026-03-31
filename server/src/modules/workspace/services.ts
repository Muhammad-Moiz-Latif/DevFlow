import { eq, and } from "drizzle-orm";
import { db } from "../../config/db";
import { WorkspaceTable } from "../../db/schema/workspaces";
import { WorkspaceMembersTable } from "../../db/schema/workspace-member";
import { ProjectTable } from "../../db/schema/projects";


export const workspaceServices = {
    async createWorkSpaceAndAdminMember(name: string, slug: string, image: string | null, ownerId: string) {
        const workspace = await db.transaction(async (tx) => {
            const [newWorkspace] = await tx.insert(WorkspaceTable).values({
                name,
                slug,
                img: image,
                owner_id: ownerId
            }).returning();

            await tx.insert(WorkspaceMembersTable).values({
                workspace_id: newWorkspace?.id,
                user_id: ownerId,
                role: 'ADMIN',
                status: "SUCCESS"
            });

            return newWorkspace;
        });

        return workspace;
    },

    async getWorkspaceViaName(name: string) {
        const [workspace] = await db.select().from(WorkspaceTable).where(
            eq(WorkspaceTable.name, name)
        ).limit(1);

        return workspace;
    },

    async getWorkspaceViaId(id: string) {
        const [workspace] = await db.select().from(WorkspaceTable).where(
            eq(WorkspaceTable.id, id)
        );

        return workspace;
    },

    async getAllWorkspaceMembers(workspaceId: string) {
        const members = await db.select().from(WorkspaceMembersTable).where(
            eq(WorkspaceMembersTable.workspace_id, workspaceId)
        );

        return members;
    },

    async updateWorkspace(workspaceId: string, data: Partial<typeof WorkspaceTable.$inferInsert>) {

        const updateData: typeof data = {};

        if (data.name !== undefined) updateData.name = data.name;
        if (data.slug !== undefined) updateData.slug = data.slug;
        if (data.img !== undefined && data.img != null) updateData.img = data.img;

        if (Object.keys(updateData).length === 0) {
            throw new Error("No fields provided to update");
        }

        const [updated] = await db
            .update(WorkspaceTable)
            .set(updateData)
            .where(eq(WorkspaceTable.id, workspaceId))
            .returning();

        return updated;
    },

    async deleteWorkspace(workspaceId: string, ownerId: string) {
        const [deleted] = await db.delete(WorkspaceTable).where(and(
            eq(WorkspaceTable.id, workspaceId),
            eq(WorkspaceTable.owner_id, ownerId)
        )).returning();

        return deleted;
    },

    async getWorkspaceMemberViaId(userId: string, workspaceId: string) {
        const [member] = await db.select().from(WorkspaceMembersTable).where(and(
            eq(WorkspaceMembersTable.user_id, userId),
            eq(WorkspaceMembersTable.workspace_id, workspaceId)
        ));

        return member;
    },

   
};