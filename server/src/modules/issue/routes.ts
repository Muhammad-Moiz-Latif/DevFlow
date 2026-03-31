import { Router } from "express";
import { IssueControllers } from "./controllers";
import { verifyJWT } from "../../middlewares/verifyJWT";
import { allowedRoles } from "../../middlewares/allowedMembers";

export const router = Router({
    mergeParams: true
});


router.post("/create-issue", verifyJWT, allowedRoles(['ADMIN', 'MEMBER']), IssueControllers.createIssue);

// GET    /workspace/:workspaceId/projects/:projectId/issues                → get all issues (kanban data)
// GET    /workspace/:workspaceId/projects/:projectId/issues/:issueId       → get single issue
// PATCH  /workspace/:workspaceId/projects/:projectId/issues/:issueId       → update issue
// DELETE /workspace/:workspaceId/projects/:projectId/issues/:issueId       → delete issue
// PATCH  /workspace/:workspaceId/projects/:projectId/issues/reorder        → drag and drop reorder
// GET    /workspace/:workspaceId/my-issues                                 → personal dashboard