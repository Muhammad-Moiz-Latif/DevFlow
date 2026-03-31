import { eq, and } from "drizzle-orm";
import { db } from "../../config/db";
import { ProjectTable } from "../../db/schema/projects";

export const projectServices = {

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

    async getAllProjects(workspaceId: string) {
        const projects = await db.select().from(ProjectTable).where(
            eq(ProjectTable.workspace_id, workspaceId)
        );

        return projects;
    },

    async getProject(workspaceId: string, projectId: string) {
        const project = await db.select().from(ProjectTable).where(and(
            eq(ProjectTable.workspace_id, workspaceId),
            eq(ProjectTable.id, projectId)
        ));

        return project;
    },

    async updateProject(workspaceId: string, projectId: string, data: Partial<typeof ProjectTable.$inferInsert>) {
        let updatedData: typeof data = {};
        if (data.name !== undefined) updatedData.name = data.name;
        if (data.slug !== undefined) updatedData.slug = data.slug;
        if (data.description !== undefined) updatedData.description = data.description;
        if (data.status !== undefined) updatedData.status = data.status;

        const [updatedProject] = await db.update(ProjectTable).set(updatedData).where(and(
            eq(ProjectTable.id, projectId),
            eq(ProjectTable.workspace_id, workspaceId)
        )).returning();

        return updatedProject;
    },

    async deleteProject(workspaceId: string, projectId: string) {
        const [deleteProject] = await db.delete(ProjectTable).where(and(
            eq(ProjectTable.id, projectId),
            eq(ProjectTable.workspace_id, workspaceId)
        )).returning();

        return deleteProject;
    },


};