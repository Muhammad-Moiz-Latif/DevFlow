import { commentControllers } from "./controllers";

// POST   /workspace/:workspaceId/issues/:issueId/comments           → create comment or reply
// GET    /workspace/:workspaceId/issues/:issueId/comments           → get all comments for an issue
// PATCH  /workspace/:workspaceId/issues/:issueId/comments/:commentId → edit your own comment
// DELETE /workspace/:workspaceId/issues/:issueId/comments/:commentId → delete your own comment