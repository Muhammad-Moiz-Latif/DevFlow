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

    async updateWorkspace(workspaceId: string, data: Partial<{
        name: string,
        slug: string,
        logo_url: string
    }>) {
        const updateData: typeof data = {};

        if (data.name !== undefined) updateData.name = data.name;
        if (data.slug !== undefined) updateData.slug = data.slug;
        if (data.logo_url !== undefined) updateData.logo_url = data.logo_url;

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

    async getWorkspaceMemberViaId(userId: string, workspaceId: string) {
        const [member] = await db.select().from(WorkspaceMembersTable).where(and(
            eq(WorkspaceMembersTable.user_id, userId),
            eq(WorkspaceMembersTable.workspace_id, workspaceId)
        ));

        return member;
    },

    async createProject(name: string, description: string, slug: string, workspaceId: string, createdBy: string) {
        const [project] = await db.insert(ProjectTable).values({
            name,
            slug,
            description,
            workspace_id: workspaceId,
            created_by: createdBy
        }).returning();

        return project;
    },
};