import type { Request, Response } from "express";
import { commentServices } from "./services";
import { issueServices } from "../issue/services";
import { sendNotification } from "../../utils/send-notification";
import { workspaceServices } from "../workspace/services";

export const commentControllers = {

    async createComment(req: Request, res: Response) {
        try {
            const { text, parentId } = req.body;
            const workspaceId = req.params.workspaceId as string;
            const issueId = req.params.issueId as string;
            const userId = req.user?.id!;

            if (!text) {
                return res.status(400).json({
                    success: false,
                    message: "Comment body is required"
                });
            };

            const doesIssueExist = await issueServices.getIssueViaWorkspaceAndIssueId(workspaceId, issueId);

            if (!doesIssueExist) {
                return res.status(404).json({
                    success: false,
                    message: "Issue not found"
                });
            };

            if (parentId) {
                const doesParentCommentExist = await commentServices.getCommentViaId(parentId);
                if (!doesParentCommentExist) {
                    return res.status(404).json({
                        success: false,
                        message: "Parent comment not found"
                    });
                };
            };

            const comment = await commentServices.createComment(issueId, userId, text, parentId);

            if (doesIssueExist.createdBy !== userId) {
                await sendNotification({
                    type: "COMMENT_ON_ISSUE",
                    message: "Someone made a comment on your issue",
                    user_id: doesIssueExist.createdBy!,
                    workspace_id: workspaceId,
                    link: "somelink"
                });
            };

            return res.status(201).json({
                success: true,
                message: "Comment created successfully!",
                data: comment
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        };
    },

    async getAllComments(req: Request, res: Response) {
        try {
            const issueId = req.params.issueId as string;
            const workspaceId = req.params.workspaceId as string;

            const doesIssueExist = await issueServices.getIssueViaWorkspaceAndIssueId(workspaceId, issueId);

            if (!doesIssueExist) {
                return res.status(404).json({
                    success: false,
                    message: "Issue does not exist"
                });
            };

            const comments = await commentServices.getAllComments(issueId);

            return res.status(200).json({
                success: true,
                message: "Retreived all comments successfully!",
                data: comments
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        };
    },

    async editComment(req: Request, res: Response) {
        try {
            const { text } = req.body;
            const commentId = req.params.commentId as string;
            const authorId = req.user?.id!;

            if (!text) {
                return res.status(400).json({
                    success: false,
                    message: "Comment body is required"
                });
            };

            const doesCommentExist = await commentServices.getCommentViaId(commentId);

            if (!doesCommentExist) {
                return res.status(404).json({
                    success: false,
                    message: "Comment does not exist"
                });
            };

            const comment = await commentServices.updateComment(commentId, text, authorId);

            return res.status(200).json({
                success: true,
                message: "Comment updated successfully",
                data: comment
            });

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    },

    async deleteComment(req: Request, res: Response) {
        try {
            const userId = req.user?.id!;
            const workspaceId = req.params.workspaceId as string;
            const commentId = req.params.commentId as string;

            const getMember = await workspaceServices.getWorkspaceMemberViaId(userId, workspaceId);

            if (!getMember) {
                res.status(403).json({
                    success: false,
                    message: "Forbiddent access"
                });
            };

            const doesCommentExist = await commentServices.getCommentViaId(commentId);

            if (!doesCommentExist) {
                return res.status(404).json({
                    success: false,
                    message: "Comment does not exist"
                });
            };

            const isAdmin = getMember?.role === "ADMIN";
            const isAuthor = doesCommentExist.authorId === userId;

            if (!isAdmin && !isAuthor) {
                return res.status(403).json({
                    success: false,
                    message: "You cannot delete this comment"
                });
            };

            await commentServices.deleteComment(commentId);

            res.status(200).json({
                success: true,
                message: "Comment deleted successfully!"
            });



        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        };
    },
};